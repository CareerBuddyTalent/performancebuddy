
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

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({ name, resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset your PerformPath password</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>PerformPath</Heading>
        </Section>
        
        <Heading style={h1}>Reset Your Password</Heading>
        
        <Text style={greeting}>Hi {name},</Text>
        
        <Text style={text}>
          We received a request to reset your password for your PerformPath account. 
          Click the button below to create a new password:
        </Text>

        <Section style={ctaSection}>
          <Button style={button} href={resetLink}>
            Reset Password
          </Button>
        </Section>

        <Text style={text}>
          This link will expire in 24 hours for security reasons.
        </Text>

        <Hr style={hr} />

        <Text style={securityText}>
          <strong>🔒 Security tip:</strong> If you didn't request this password reset, 
          you can safely ignore this email. Your password will remain unchanged.
        </Text>

        <Hr style={hr} />

        <Text style={footer}>
          If you're having trouble with the button above, copy and paste the following URL into your browser:<br />
          <Link href={resetLink} style={linkStyle}>
            {resetLink}
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

export default PasswordResetEmail

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

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  lineHeight: '36px',
  margin: '30px 40px 20px',
  textAlign: 'center' as const,
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
  backgroundColor: '#dc2626',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '18px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '16px 32px',
  margin: '0 auto',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 40px',
}

const securityText = {
  color: '#059669',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '20px 40px',
  padding: '16px',
  backgroundColor: '#ecfdf5',
  borderRadius: '8px',
}

const footer = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '30px 40px 20px',
}

const linkStyle = {
  color: '#4f46e5',
  textDecoration: 'none',
  fontSize: '12px',
  wordBreak: 'break-all' as const,
}

const signature = {
  color: '#374151',
  fontSize: '14px',
  margin: '20px 40px',
  textAlign: 'center' as const,
  fontWeight: '500',
}
