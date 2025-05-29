
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import React from 'npm:react@18.3.1';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { NotificationEmail } from './_templates/notification.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  email: string;
  name: string;
  title: string;
  message: string;
  type: 'review_reminder' | 'goal_deadline' | 'feedback_received' | 'survey_reminder' | 'cycle_started' | 'general';
  actionUrl?: string;
  actionText?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, title, message, type, actionUrl, actionText }: NotificationEmailRequest = await req.json();
    
    console.log('Sending notification email to:', email, 'Type:', type);
    
    const html = await renderAsync(
      React.createElement(NotificationEmail, { 
        name, 
        title, 
        message, 
        type, 
        actionUrl, 
        actionText 
      })
    );

    const { data, error } = await resend.emails.send({
      from: "PerformPath <notifications@resend.dev>",
      to: email,
      subject: title,
      html: html,
    });

    if (error) {
      console.error("Error sending notification email:", error);
      throw error;
    }

    console.log("Notification email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
