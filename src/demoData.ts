import { RescuePlan } from './types';

export interface DemoCase {
  key: 'student' | 'professional' | 'entrepreneur';
  name: string;
  role: string;
  input: string;
  energy: 'low' | 'medium' | 'high';
  availableTimeMinutes: number;
  rescuePlan: RescuePlan;
}

export const demoCases: DemoCase[] = [
  {
    key: 'student',
    name: 'Student Crisis',
    role: 'University Student',
    input: 'I have a DSA assignment due tonight at 11:59 PM, a hackathon prototype to submit by Sunday, an electricity bill due today, an interview tomorrow morning, and a group project meeting at 6 PM. I am tired and I only have around 5 focused hours today.',
    energy: 'low',
    availableTimeMinutes: 300,
    rescuePlan: {
      risk: 'critical',
      doThisNow: {
        title: 'Pay electricity bill first if it takes under 10 minutes, then immediately start the DSA assignment.',
        explanation: 'Paying the bill is an immediate, high-cognitive-load hazard if left hanging. Clear this 10-minute task immediately so your mind is fully clear to transition into Deep Work for the DSA assignment.',
        durationMinutes: 10
      },
      observation: 'User has multiple urgent commitments and only 5 focused hours, so fast urgent tasks must be cleared and deep work must be protected.',
      conflictWarnings: [
        'The 6 PM group project meeting interrupts deep work on the DSA assignment.',
        'Interview preparation is important, but should be kept to essentials tonight.',
        'Hackathon prototype work should not consume deep work time before the DSA assignment is submitted.'
      ],
      schedule: [
        {
          id: 's-stud-1',
          time: '14:00 - 14:10',
          taskTitle: 'Pay electricity bill',
          duration: '10 min',
          description: 'Log into utility portal, clear immediate payment, and secure reference receipt.',
          category: 'Admin - Quick Win'
        },
        {
          id: 's-stud-2',
          time: '14:10 - 14:35',
          taskTitle: 'Prepare DSA assignment workspace',
          duration: '25 m',
          description: 'Set up editor, isolate the specific assignment sheet, and mark high-yield items.',
          category: 'Prep Block'
        },
        {
          id: 's-stud-3',
          time: '14:35 - 16:05',
          taskTitle: 'Complete highest-mark DSA problems',
          duration: '90 min',
          description: 'Focus exclusively on your core algoritmic structures. No social media interruptions.',
          category: 'Deep Work'
        },
        {
          id: 's-stud-4',
          time: '18:00 - 18:30',
          taskTitle: 'Group Project Meeting',
          duration: '30 min',
          description: 'Synchronize on project deliverables. Limit check-in length to safeguard focus.',
          category: 'Collaboration'
        },
        {
          id: 's-stud-5',
          time: '18:30 - 20:00',
          taskTitle: 'Finish and review DSA assignment',
          duration: '90 min',
          description: 'Build edge tests, wrap comments, compile package files, and trigger final LMS submission.',
          category: 'Deep Work'
        },
        {
          id: 's-stud-6',
          time: '20:00 - 20:45',
          taskTitle: 'Interview prep basics',
          duration: '45 min',
          description: 'Review technical resume, key bullet summaries, and common leadership stories.',
          category: 'Career Prep'
        },
        {
          id: 's-stud-7',
          time: 'Focus Deferred',
          taskTitle: 'Hackathon prototype planning only, not full build',
          duration: 'Remaining time',
          description: 'Keep this light: jot down architectural notes. Full implementation deferred to Friday/Saturday.',
          category: 'Deferred Task'
        }
      ],
      tasks: [
        {
          id: 't-stud-1',
          title: 'Electricity Bill',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today (Immediate)',
          category: 'Finance',
          microActions: [
            { id: 'm-sc-1-1', text: 'Open electricity bill portal online', completed: false },
            { id: 'm-sc-1-2', text: 'Validate customer invoice ID and trigger payment swipe', completed: false }
          ]
        },
        {
          id: 't-stud-2',
          title: 'DSA Assignment',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Tonight at 11:59 PM',
          category: 'Academics',
          microActions: [
            { id: 'm-sc-2-1', text: 'Complete worst-case complexity analysis', completed: false },
            { id: 'm-sc-2-2', text: 'Write traversals for Graph datasets', completed: false },
            { id: 'm-sc-2-3', text: 'Run debug tests and bundle submission folder', completed: false }
          ]
        },
        {
          id: 't-stud-3',
          title: 'Group Project Meeting',
          priority: 'medium',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: '6 PM today',
          category: 'meeting / academic',
          microActions: [
            { id: 'm-sc-3-1', text: 'Join the meeting on time', completed: false },
            { id: 'm-sc-3-2', text: 'Give a concise status update', completed: false },
            { id: 'm-sc-3-3', text: 'Avoid accepting extra scope tonight', completed: false },
            { id: 'm-sc-3-4', text: 'Leave with clear next steps', completed: false }
          ]
        },
        {
          id: 't-stud-4',
          title: 'Interview Preparation',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Tomorrow Morning',
          category: 'Career',
          microActions: [
            { id: 'm-sc-4-1', text: 'Walk through verbal self-intro twice in front of screen', completed: false },
            { id: 'm-sc-4-2', text: 'Identify 2 project highlights to present', completed: false }
          ]
        },
        {
          id: 't-stud-5',
          title: 'Hackathon Prototype',
          priority: 'low',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Sunday Eve',
          category: 'Extracurricular',
          microActions: [
            { id: 'm-sc-5-1', text: 'Draft high-level functional architectural scheme', completed: false },
            { id: 'm-sc-5-2', text: 'Defer heavy coding to Friday afternoon', completed: false }
          ]
        }
      ],
      drafts: [
        {
          id: 'd-stud-1',
          title: 'Group Meeting Check-In & Boundary Template',
          recipient: 'Project Group Slack',
          type: 'message',
          content: 'Hey team, looking forward to our sync at 6 PM! I have a major DSA assignment deadline tonight and an interview tomorrow morning, so my energy is a bit drained and I will have a hard stop at 6:30 PM. I have preloaded my slides in the dock so we can review them right away during the call!'
        }
      ],
      recommendations: [
        'Clear the fast bill payment first.',
        'Protect the biggest deep-work block for the DSA assignment.',
        'Keep the group meeting concise.',
        'Prepare only interview essentials tonight.',
        'Push hackathon prototype deep work to tomorrow unless DSA is submitted early.'
      ]
    }
  },
  {
    key: 'professional',
    name: 'Working Professional',
    role: 'Corporate Professional',
    input: 'I need to submit a client presentation by 6 PM, attend a team meeting at 4 PM, send a project update to my manager, review 30 unread emails, and book a doctor appointment. I have low energy and only 3 focused hours left today.',
    energy: 'low',
    availableTimeMinutes: 180,
    rescuePlan: {
      risk: 'high',
      doThisNow: {
        title: 'Finish client presentation outline and send manager a brief status update',
        explanation: 'Your client presentation at 6 PM represents the absolute highest business impact. Send your manager a draft link next to claim fast support.',
        durationMinutes: 75
      },
      observation: 'With only 3 focused hours remaining, your schedule must protect the client slide deck. The team sync and quick email checks fit in, while the doctor booking should be deferred to tomorrow morning.',
      conflictWarnings: [
        'Team meeting at 4 PM splits the available 3-hour focus window.'
      ],
      schedule: [
        {
          id: 's-pro-1',
          time: '14:30 - 15:45',
          taskTitle: 'Finish client presentation outline',
          duration: '75 min',
          description: 'Iterate client slideware outline. Focus on structural graphics, keeping text sparse.',
          category: 'Core Work - Vital'
        },
        {
          id: 's-pro-2',
          time: '15:45 - 16:00',
          taskTitle: 'Send manager a brief status update',
          duration: '15 min',
          description: 'Share presentation work-in-progress link and ask for micro check-ins.',
          category: 'Admin - Quick Win'
        },
        {
          id: 's-pro-3',
          time: '16:00 - 16:30',
          taskTitle: 'Attend team meeting',
          duration: '30 min',
          description: 'Deliver crisp visual check-in and claim feedback quickly.',
          category: 'Meetings'
        },
        {
          id: 's-pro-4',
          time: '16:30 - 16:50',
          taskTitle: 'Quick triage of top 5 urgent emails',
          duration: '20 min',
          description: 'Scan only for direct notes from stakeholders. Snooze administrative threads.',
          category: 'Comms'
        },
        {
          id: 's-pro-5',
          time: 'Postponed',
          taskTitle: 'Book doctor appointment',
          duration: 'Deferred',
          description: 'Snoozed until tomorrow to defend client presentation quality.',
          category: 'Personal'
        }
      ],
      tasks: [
        {
          id: 't-pro-1',
          title: 'Client presentation',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today at 6:00 PM',
          category: 'Client',
          microActions: [
            { id: 'm-pr-11', text: 'Polish key problem & solution summary slide layouts', completed: false },
            { id: 'm-pr-12', text: 'Export as responsive PDF to perform quick viewing tests', completed: false }
          ]
        },
        {
          id: 't-pro-2',
          title: 'Team meeting',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today at 4:00 PM',
          category: 'Internal Sync',
          microActions: [
            { id: 'm-pr-21', text: 'Join calendar invite link on time', completed: false },
            { id: 'm-pr-22', text: 'Present current status block concisely', completed: false }
          ]
        },
        {
          id: 't-pro-3',
          title: 'Manager update',
          priority: 'medium',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today by 3:45 PM',
          category: 'Internal Comms',
          microActions: [
            { id: 'm-pr-31', text: 'Draft bulleted achievements cataloging progress', completed: false },
            { id: 'm-pr-32', text: 'E-mail outline draft directly for visibility', completed: false }
          ]
        },
        {
          id: 't-pro-4',
          title: 'Email review',
          priority: 'low',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today',
          category: 'Comms',
          microActions: [
            { id: 'm-pr-41', text: 'Filter mailbox by critical stakeholders', completed: false },
            { id: 'm-pr-42', text: 'Ignore general newsletters and administrative alerts', completed: false }
          ]
        },
        {
          id: 't-pro-5',
          title: 'Doctor appointment',
          priority: 'low',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Flexible',
          category: 'Personal',
          microActions: [
            { id: 'm-pr-51', text: 'Pin doctor clinic link in tasks list to address tomorrow morning', completed: false }
          ]
        }
      ],
      drafts: [
        {
          id: 'd-pro-1',
          title: 'Manager presentation check-in update',
          recipient: 'Manager Email',
          type: 'email',
          content: 'Hi Sarah, I am finalizing the client slide deck due at 6 PM. I have attached the latest structural outline link. I have focused deeply on our key metrics (Slide 3) and high-level milestones (Slide 5). I would appreciate your quick feedback on these before the final client pitch!'
        }
      ],
      recommendations: [
        'Close other desktop applications to keep all physical attention on client presentation outline.',
        'Use pre-existing corporate styling schemas instead of trying to format custom slides.',
        'Decline late check-ins after 5 PM to guarantee a smooth client handover.'
      ]
    }
  },
  {
    key: 'entrepreneur',
    name: 'Entrepreneur',
    role: 'Co-founder',
    input: 'I have an investor pitch deck due tomorrow morning, a customer demo at 5 PM, a product bug that needs fixing, a GST payment due today, and a hiring call tonight. I am overwhelmed and need a realistic plan.',
    energy: 'high',
    availableTimeMinutes: 480,
    rescuePlan: {
      risk: 'critical',
      doThisNow: {
        title: 'Stabilize customer demo and pay GST if it takes under 10 minutes',
        explanation: 'Stabilizing the customer demo environment is crucial for client trust, and completing the GST transfer clears regulatory liability early before government banking cutoffs.',
        durationMinutes: 40
      },
      observation: 'As a startup founder, critical operations and investor deliverables must run hand-in-hand. We have structured a sequential plan resolving the hot bug, executing the brief GST regulatory transaction, driving the live Demo call, and preserving your focus tonight for the Investor Pitch deck.',
      conflictWarnings: [
        'Customer demo and hiring call compete with investor deck preparation.'
      ],
      schedule: [
        {
          id: 's-ent-1',
          time: '13:00 - 15:00',
          taskTitle: 'Resolve hot product bug',
          duration: '120 min',
          description: 'Identify current validation exception. Deploy rapid system hotfix across cloud servers.',
          category: 'Engineering Quality'
        },
        {
          id: 's-ent-2',
          time: '15:00 - 15:10',
          taskTitle: 'GST payment clearance',
          duration: '10 min',
          description: 'Access GST Government Portal, authorize transfer, and log invoice clearance.',
          category: 'Financial Regulatory'
        },
        {
          id: 's-ent-3',
          time: '15:10 - 17:00',
          taskTitle: 'Stabilize customer demo environment',
          duration: '110 min',
          description: 'Inject clean demo data assets, calibrate API endpoints, and rehearse core story line.',
          category: 'Prep Block'
        },
        {
          id: 's-ent-4',
          time: '17:00 - 17:45',
          taskTitle: 'Customer demo call',
          duration: '45 min',
          description: 'Conduct live demonstration of platform value. Secure agreements with lead prospect.',
          category: 'Sales Execution'
        },
        {
          id: 's-ent-5',
          time: '19:00 - 19:40',
          taskTitle: 'Conduct candidate hiring Call',
          duration: '40 min',
          description: 'Lead sourcing discussion. Benchmark candidates technical alignment and fit.',
          category: 'Recruiting'
        },
        {
          id: 's-ent-6',
          time: '20:00 - 23:00',
          taskTitle: 'Draft and polish investor pitch deck',
          duration: '180 min',
          description: 'Formulate core market opportunity slides, TAM graphics, and unit economics charts.',
          category: 'Investor Relations'
        }
      ],
      tasks: [
        {
          id: 't-ent-1',
          title: 'Investor pitch deck',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Tomorrow Morning',
          category: 'Fundraising',
          microActions: [
            { id: 'm-en-11', text: 'Confirm TAM metric details look accurate on page 3', completed: false },
            { id: 'm-en-12', text: 'Validate current cap table breakdown numbers match financial spreadsheets', completed: false }
          ]
        },
        {
          id: 't-ent-2',
          title: 'Customer demo',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today at 5:00 PM',
          category: 'Sales',
          microActions: [
            { id: 'm-en-21', text: 'Validate sharing resolution and cursor pointer displays', completed: false },
            { id: 'm-en-22', text: 'Prepare direct login access path for fallback demo user accounts', completed: false }
          ]
        },
        {
          id: 't-ent-3',
          title: 'Product bug',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today (Immediate)',
          category: 'Tech Stack',
          microActions: [
            { id: 'm-en-31', text: 'Incorporate unit test catching the reported trace null value exception', completed: false },
            { id: 'm-en-32', text: 'Incorporate defensive query validation blocks across backend module', completed: false }
          ]
        },
        {
          id: 't-ent-4',
          title: 'GST payment',
          priority: 'high',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today (Immediate)',
          category: 'Finance',
          microActions: [
            { id: 'm-en-41', text: 'Authenticate across GST state taxation platform', completed: false },
            { id: 'm-en-42', text: 'Trigger transaction transfer and save receipt copy', completed: false }
          ]
        },
        {
          id: 't-ent-5',
          title: 'Hiring call',
          priority: 'low',
          done: false,
          delayed: false,
          stuck: false,
          skipped: false,
          deadline: 'Today at 7:00 PM',
          category: 'Sourcing',
          microActions: [
            { id: 'm-en-51', text: 'Examine candidate profile details and target software experience metrics', completed: false }
          ]
        }
      ],
      drafts: [
        {
          id: 'd-ent-1',
          title: 'Customer Demo Agenda confirmation mail',
          recipient: 'Prospect Lead',
          type: 'email',
          content: 'Hi Julian, looking forward to our walk-through today at 5 PM! To keep our session highly high-value, the agenda will be: 1) 10-Min Overview of custom integrations, 2) 15-Min Live walkthrough solving multi-node telemetry, and 3) 5-Min Q&A on pricing.'
        }
      ],
      recommendations: [
        'Complete GST compliance step before 4 PM to guarantee banking service uptime.',
        'If bug fixes exceed 90 minutes, mock data records on staging for the customer demo sequence.',
        'Keep healthy nutrition snacks on the workstation to sustain co-founder focus.'
      ]
    }
  }
];
