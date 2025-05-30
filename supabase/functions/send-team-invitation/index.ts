
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationEmailData {
  email: string;
  inviterName: string;
  companyName?: string;
  role: string;
  department?: string;
  invitationToken: string;
  expiresAt: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: invitationData }: { data: InvitationEmailData } = await req.json();
    
    console.log('Sending team invitation email to:', invitationData.email);

    // Validate required fields
    if (!invitationData.email || !invitationData.inviterName || !invitationData.invitationToken) {
      throw new Error('Missing required fields: email, inviterName, or invitationToken');
    }

    // Format expiration date
    const expirationDate = new Date(invitationData.expiresAt).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Create invitation URL - using the current origin for the invitation link
    const invitationUrl = `${req.headers.get('origin') || 'https://eubxxtqbyrlivnenhyjk.supabase.co'}/signup?token=${invitationData.invitationToken}`;

    // Prepare email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Team Invitation - PerformanceBuddy</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .invitation-card { background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin: 20px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .details { background: #e3f2fd; padding: 15px; border-radius: 6px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 You're Invited to Join Our Team!</h1>
              <p>PerformanceBuddy - Team Performance Management</p>
            </div>
            
            <div class="content">
              <div class="invitation-card">
                <h2>Hello there! 👋</h2>
                <p><strong>${invitationData.inviterName}</strong> has invited you to join ${invitationData.companyName ? `<strong>${invitationData.companyName}</strong>` : 'their team'} on PerformanceBuddy.</p>
                
                <div class="details">
                  <h3>📋 Invitation Details</h3>
                  <p><strong>Role:</strong> ${invitationData.role.charAt(0).toUpperCase() + invitationData.role.slice(1)}</p>
                  ${invitationData.department ? `<p><strong>Department:</strong> ${invitationData.department}</p>` : ''}
                  <p><strong>Expires:</strong> ${expirationDate}</p>
                </div>
                
                <p>PerformanceBuddy helps teams track goals, manage performance reviews, and drive continuous improvement. You'll be able to:</p>
                <ul>
                  <li>Set and track personal and team goals</li>
                  <li>Participate in performance reviews</li>
                  <li>Provide and receive feedback</li>
                  <li>Access learning and development resources</li>
                </ul>
                
                <div style="text-align: center;">
                  <a href="${invitationUrl}" class="cta-button">Accept Invitation & Join Team</a>
                </div>
                
                <p style="margin-top: 20px; font-size: 14px; color: #666;">
                  If the button above doesn't work, you can copy and paste this link into your browser:<br>
                  <a href="${invitationUrl}">${invitationUrl}</a>
                </p>
              </div>
              
              <div class="footer">
                <p>This invitation will expire on ${expirationDate}.</p>
                <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                <p>© 2024 PerformanceBuddy. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'PerformanceBuddy <invitations@resend.dev>',
        to: [invitationData.email],
        subject: `You're invited to join ${invitationData.companyName || 'the team'} on PerformanceBuddy`,
        html: emailHtml,
      }),
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Resend API error:', errorData);
      throw new Error(`Failed to send email: ${emailResponse.status} ${errorData}`);
    }

    const emailResult = await emailResponse.json();
    console.log('Email sent successfully:', emailResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResult.id,
        message: 'Team invitation email sent successfully' 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in send-team-invitation function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
