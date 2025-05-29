
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface NotificationEmailProps {
  name: string;
  title: string;
  message: string;
  type: 'review_reminder' | 'goal_deadline' | 'feedback_received' | 'survey_reminder' | 'cycle_started' | 'general';
  actionUrl?: string;
  actionText?: string;
}

const typeIcons = {
  review_reminder: '📋',
  goal_deadline: '🎯',
  feedback_received: '💬',
  survey_reminder: '📊',
  cycle_started: '🚀',
  general: '🔔',
};

const typeColors = {
  review_reminder: '#3b82f6',
  goal_deadline: '#f59e0b',
  feedback_received: '#10b981',
  survey_reminder: '#8b5cf6',
  cycle_started: '#f97316',
  general: '#6b7280',
};

export const NotificationEmail = ({ name, title, message, type, actionUrl, actionText }: NotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>PerformPath</Heading>
        </Section>
        
        <Section style={iconSection}>
          <Text style={{...icon, color: typeColors[type]}}>{typeIcons[type]}</Text>
        </Section>
        
        <Heading style={h1}>{title}</Heading>
        
        <Text style={greeting}>Hi {name},</Text>
        
        <Text style={text}>{message}</Text>

        {actionUrl && actionText && (
          <Section style={ctaSection}>
            <Button style={{...button, backgroundColor: typeColors[type]}} href={actionUrl}>
              {actionText}
            </Button>
          </Section>
        )}

        <Hr style={hr} />

        <Section style={quickLinksSection}>
          <Text style={h3}>Quick Access:</Text>
          <Link href="https://performpath.app/dashboard" style={quickLink}>
            🏠 Dashboard
          </Link>
          <Link href="https://performpath.app/performance" style={quickLink}>
            📈 Performance
          </Link>
          <Link href="https://performpath.app/reviews" style={quickLink}>
            ⭐ Reviews
          </Link>
          <Link href="https://performpath.app/settings" style={quickLink}>
            ⚙️ Settings
          </Link>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          You're receiving this email because you have notifications enabled in your PerformPath account.<br />
          <Link href="https://performpath.app/settings" style={settingsLink}>
            Manage your email preferences
          </Link>
        </Text>

        <Text style={signature}>
          Best regards,<br />
          The PerformPath Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default NotificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
}

const logoSection = {
  padding: '20px 40px',
  textAlign: 'center' as const,
  backgroundColor: '#1a1a1a',
}

const logo = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '-0.5px',
}

const iconSection = {
  textAlign: 'center' as const,
  margin: '30px 0 20px',
}

const icon = {
  fontSize: '48px',
  margin: '0',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '32px',
  margin: '20px 40px',
  textAlign: 'center' as const,
}

const h3 = {
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '20px 0 10px',
}

const greeting = {
  color: '#374151',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '20px 40px 10px',
  fontWeight: '500',
}

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 40px',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0',
}

const button = {
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 28px',
  margin: '0 auto',
}

const quickLinksSection = {
  margin: '30px 40px',
}

const quickLink = {
  color: '#4f46e5',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'block',
  margin: '6px 0',
  fontWeight: '500',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 40px',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '30px 40px 20px',
  textAlign: 'center' as const,
}

const settingsLink = {
  color: '#4f46e5',
  textDecoration: 'none',
  fontWeight: '500',
}

const signature = {
  color: '#374151',
  fontSize: '14px',
  margin: '20px 40px',
  textAlign: 'center' as const,
  fontWeight: '500',
}
