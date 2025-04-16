
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  name: string;
}

export const WelcomeEmail = ({ name }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to PerformPath!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to PerformPath, {name}!</Heading>
        <Text style={text}>
          We're excited to have you join our performance management platform. 
          Get ready to track your goals, receive feedback, and grow your career.
        </Text>
        <Text style={text}>
          You can now log in to your account and start exploring the platform.
        </Text>
        <Link href="https://performpath.app/login" target="_blank" style={button}>
          Get Started
        </Link>
        <Text style={footer}>
          If you have any questions, feel free to reach out to our support team.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#000000',
  borderRadius: '3px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
  margin: '20px 0',
}

const footer = {
  color: '#898989',
  fontSize: '14px',
  margin: '24px 0',
}
