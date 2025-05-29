
import { lazy } from 'react';

// Lazy load all pages to reduce initial bundle size
export const Dashboard = lazy(() => import('./Dashboard'));
export const Home = lazy(() => import('./Home'));
export const Performance = lazy(() => import('./Performance'));
export const Skills = lazy(() => import('./Skills'));
export const Reviews = lazy(() => import('./Reviews'));
export const OKRs = lazy(() => import('./OKRs'));
export const OKRAlignment = lazy(() => import('./OKRAlignment'));
export const UserManagement = lazy(() => import('./UserManagement'));
export const CompanyManagement = lazy(() => import('./CompanyManagement'));
export const ReviewTemplates = lazy(() => import('./ReviewTemplates'));
export const Surveys = lazy(() => import('./Surveys'));
export const Settings = lazy(() => import('./Settings'));
export const TestingDashboard = lazy(() => import('./TestingDashboard'));
export const NotFound = lazy(() => import('./NotFound'));

// Phase 4: Advanced Features
export const Learning = lazy(() => import('./Learning'));
export const Workflows = lazy(() => import('./Workflows'));
export const Integrations = lazy(() => import('./Integrations'));

// Phase 5: Enterprise Features
export const Enterprise = lazy(() => import('./Enterprise'));
