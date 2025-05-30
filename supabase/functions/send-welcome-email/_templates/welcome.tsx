
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
  Img,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to PerformPath - Your journey to peak performance starts here!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Heading style={logo}>PerformPath</Heading>
        </Section>
        
        <Heading style={h1}>Welcome to PerformPath, {name}!</Heading>
        
        <Text style={hero}>
          🎉 Congratulations on joining our performance management platform! 
          We're excited to help you track goals, receive valuable feedback, and accelerate your career growth.
        </Text>

        <Section style={featureSection}>
          <Heading style={h2}>What you can do with PerformPath:</Heading>
          <Text style={feature}>📊 <strong>Track Performance:</strong> Set and monitor your goals with real-time progress tracking</Text>
          <Text style={feature}>💬 <strong>Get Feedback:</strong> Receive continuous feedback from peers and managers</Text>
          <Text style={feature}>🎯 <strong>Manage OKRs:</strong> Align your objectives with company goals</Text>
          <Text style={feature}>📈 <strong>View Analytics:</strong> Get insights into your performance trends</Text>
          <Text style={feature}>🚀 <strong>Career Development:</strong> Create development plans and track skills</Text>
        </Section>

        <Section style={ctaSection}>
          <Button style={button} href="https://performpath.app/dashboard">
            Get Started Now
          </Button>
        </Section>

        <Hr style={hr} />

        <Section style={quickLinksSection}>
          <Heading style={h3}>Quick Links:</Heading>
          <Link href="https://performpath.app/performance" style={quickLink}>
            📋 My Performance Dashboard
          </Link>
          <Link href="https://performpath.app/okrs" style={quickLink}>
            🎯 Set Your First Goals
          </Link>
          <Link href="https://performpath.app/reviews" style={quickLink}>
            ⭐ View Review Cycles
          </Link>
          <Link href="https://performpath.app/settings" style={quickLink}>
            ⚙️ Account Settings
          </Link>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Need help getting started? Our support team is here to help.<br />
          Email us at <Link href="mailto:support@performpath.app" style={supportLink}>support@performpath.app</Link>
        </Text>

        <Text style={signature}>
          Best regards,<br />
          The PerformPath Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

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

const h2 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '28px',
  margin: '30px 0 15px',
}

const h3 = {
  color: '#1a1a1a',
  fontSize: '18px',
  fontWeight: '600',
  lineHeight: '24px',
  margin: '20px 0 10px',
}

const hero = {
  color: '#4f46e5',
  fontSize: '18px',
  lineHeight: '28px',
  margin: '20px 40px 30px',
  textAlign: 'center' as const,
  fontWeight: '500',
}

const featureSection = {
  margin: '30px 40px',
}

const feature = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '12px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '40px 0',
}

const button = {
  backgroundColor: '#4f46e5',
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

const quickLinksSection = {
  margin: '30px 40px',
}

const quickLink = {
  color: '#4f46e5',
  fontSize: '14px',
  textDecoration: 'none',
  display: 'block',
  margin: '8px 0',
  fontWeight: '500',
}

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 40px',
}

const footer = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '30px 40px 20px',
  textAlign: 'center' as const,
}

const supportLink = {
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
