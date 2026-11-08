import type { DemoVariant } from './studio';

export type StudioMedia =
  | { kind: 'image'; src: string; alt: string }
  | { kind: 'video'; src: string; poster: string; alt: string; captions?: string };

// Add files under public/studio/ and use their /studio/... URLs here.
// A supplied image or video replaces the concept illustration automatically.
// Example: { kind: 'video', src: '/studio/demo.mp4', poster: '/studio/demo.jpg', alt: 'Application walkthrough' }
export const openingMedia: StudioMedia | undefined = undefined;

export interface ServicePresentation {
  id: string;
  label: string;
  caption: string;
  preview: 'software' | 'automation' | 'integration' | 'equipment';
  media?: StudioMedia;
}

export const servicePresentation: ServicePresentation[] = [
  { id: 'custom-software', label: 'Custom Software', caption: 'One place for your team, your information, and the way you work.', preview: 'software' },
  { id: 'workflow-automation', label: 'Automation & AI', caption: 'Less repetitive admin. Useful automation, with people in control.', preview: 'automation' },
  { id: 'systems-integration', label: 'Systems Integration', caption: 'Connect the tools you already use. Keep information moving.', preview: 'integration' },
  { id: 'connected-systems', label: 'Connected Systems & IoT', caption: 'Know what your equipment is doing, wherever the work happens.', preview: 'equipment' },
];

export const projectMedia: Partial<Record<string, StudioMedia>> = {};

export const projectLabels: Record<DemoVariant, string> = {
  operations: 'Automation', equipment: 'Connected equipment', site: 'Spatial interfaces', vision: 'Sensor visualization',
};
