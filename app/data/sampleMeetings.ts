export interface Speaker {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  talkTimeSeconds: number;
  talkPercentage: number;
}

export interface TranscriptLine {
  id: string;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  speakerAvatar: string;
  speakerColor: string;
  startTime: number; // in seconds
  endTime: number; // in seconds
  text: string;
  highlightType?: 'insight' | 'action' | 'question' | 'risk' | 'bookmark';
  highlightNote?: string;
}

export interface ActionItem {
  id: string;
  task: string;
  assigneeName: string;
  assigneeAvatar: string;
  dueDate: string;
  completed: boolean;
  timestamp: number; // jump to call second
  category: 'Product' | 'Engineering' | 'Sales' | 'Design' | 'Compliance';
}

export interface Clip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  creatorName: string;
  creatorAvatar: string;
  sharedUrl: string;
  tags: string[];
}

export interface AISummaryTemplate {
  id: string;
  name: string;
  icon: string;
  description: string;
  overview: string;
  keyTakeaways: string[];
  sections: {
    title: string;
    items: string[];
  }[];
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  durationSeconds: number;
  durationFormatted: string;
  platform: 'Zoom' | 'Google Meet' | 'Microsoft Teams';
  organizer: string;
  status: 'Recorded' | 'Live' | 'Scheduled';
  speakers: Speaker[];
  transcript: TranscriptLine[];
  summaries: Record<string, AISummaryTemplate>;
  actionItems: ActionItem[];
  clips: Clip[];
  tags: string[];
  videoThumbnail: string;
}

export const SAMPLE_MEETINGS: Meeting[] = [
  {
    id: 'mtg-8-person-q4-roadmap',
    title: 'Q4 Product Strategy & Cross-Functional Architecture Sync',
    date: '2026-09-29T10:00:00Z',
    durationSeconds: 3240, // 54 minutes
    durationFormatted: '54m 00s',
    platform: 'Zoom',
    organizer: 'Sarah Chen',
    status: 'Recorded',
    tags: ['Strategy', 'Roadmap', '8-Person Sync', 'Product', 'Engineering'],
    videoThumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    speakers: [
      { id: 'spk-1', name: 'Sarah Chen', role: 'VP of Product (Host)', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', color: '#3b82f6', talkTimeSeconds: 972, talkPercentage: 30 },
      { id: 'spk-2', name: 'Alex Rivera', role: 'Lead Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', color: '#10b981', talkTimeSeconds: 648, talkPercentage: 20 },
      { id: 'spk-3', name: 'Marcus Brody', role: 'Director of Sales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', color: '#f59e0b', talkTimeSeconds: 486, talkPercentage: 15 },
      { id: 'spk-4', name: 'Priya Patel', role: 'Head of Design', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', color: '#ec4899', talkTimeSeconds: 388, talkPercentage: 12 },
      { id: 'spk-5', name: 'David Kim', role: 'Sr Backend Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', color: '#8b5cf6', talkTimeSeconds: 291, talkPercentage: 9 },
      { id: 'spk-6', name: 'Elena Rostova', role: 'Customer Success Lead', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80', color: '#06b6d4', talkTimeSeconds: 226, talkPercentage: 7 },
      { id: 'spk-7', name: 'James Wright', role: 'Growth Marketing Director', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80', color: '#14b8a6', talkTimeSeconds: 129, talkPercentage: 4 },
      { id: 'spk-8', name: 'Jordan Lee', role: 'Security & Compliance Lead', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80', color: '#64748b', talkTimeSeconds: 100, talkPercentage: 3 }
    ],
    transcript: [
      {
        id: 'tr-1',
        speakerId: 'spk-1',
        speakerName: 'Sarah Chen',
        speakerRole: 'VP of Product (Host)',
        speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#3b82f6',
        startTime: 0,
        endTime: 24,
        text: "Alright everyone, thanks for hopping on. We have all 8 cross-functional leads here today for our Q4 Strategy Alignment. Our main goals are finalizing the real-time AI audio indexing pipeline, addressing enterprise compliance for EU servers, and aligning Sales & Marketing on our Q4 launch window."
      },
      {
        id: 'tr-2',
        speakerId: 'spk-3',
        speakerName: 'Marcus Brody',
        speakerRole: 'Director of Sales',
        speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#f59e0b',
        startTime: 25,
        endTime: 65,
        text: "Thanks Sarah. From the field perspective: we have 14 enterprise prospects waiting on SOC2 Type II certification and multi-speaker AI summary templates. If we hit the November 15 launch date, we can unlock around $1.4M in ARR before end of quarter.",
        highlightType: 'insight',
        highlightNote: 'Enterprise pipeline opportunity: $1.4M ARR dependent on Nov 15 release'
      },
      {
        id: 'tr-3',
        speakerId: 'spk-2',
        speakerName: 'Alex Rivera',
        speakerRole: 'Lead Architect',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#10b981',
        startTime: 66,
        endTime: 120,
        text: "Let me speak to the technical architecture. We recently benchmarked our WebSocket transcription streamer against Whisper Large v3 and Deepgram Nova-2. We managed to get glass-to-glass transcript latency down to 340ms across 8 simultaneous audio streams.",
        highlightType: 'insight',
        highlightNote: 'Latency milestone achieved: 340ms end-to-end transcription stream'
      },
      {
        id: 'tr-4',
        speakerId: 'spk-5',
        speakerName: 'David Kim',
        speakerRole: 'Sr Backend Engineer',
        speakerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#8b5cf6',
        startTime: 121,
        endTime: 165,
        text: "Just to add on Alex's point — the main bottleneck currently is GPU memory overhead during peak speaker overlap when 4 or more participants talk at the same time. David and I are introducing chunked audio buffer pooling to reduce memory footprint by 40%.",
        highlightType: 'action',
        highlightNote: 'David & Alex: Implement GPU chunked audio buffer pooling to cut memory by 40%'
      },
      {
        id: 'tr-5',
        speakerId: 'spk-4',
        speakerName: 'Priya Patel',
        speakerRole: 'Head of Design',
        speakerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#ec4899',
        startTime: 166,
        endTime: 215,
        text: "From a UI/UX standpoint, we redesigned the multi-speaker transcript view to visually group overlapping dialogue turns and color-code speaker badges dynamically. We tested this with 12 enterprise user calls last week and satisfaction jumped from 68% to 94%.",
        highlightType: 'insight',
        highlightNote: 'UX Satisfaction rose to 94% with color-coded speaker timeline'
      },
      {
        id: 'tr-6',
        speakerId: 'spk-6',
        speakerName: 'Elena Rostova',
        speakerRole: 'Customer Success Lead',
        speakerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#06b6d4',
        startTime: 216,
        endTime: 260,
        text: "That aligns with what CS is hearing! Customers love being able to click directly on an Action Item in the summary tab and immediately jump to the exact 5-second video timestamp where the speaker made the promise.",
        highlightType: 'bookmark',
        highlightNote: 'Customer delight feature: One-click action item to video timestamp jump'
      },
      {
        id: 'tr-7',
        speakerId: 'spk-8',
        speakerName: 'Jordan Lee',
        speakerRole: 'Security & Compliance Lead',
        speakerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#64748b',
        startTime: 261,
        endTime: 300,
        text: "I need to highlight a potential compliance risk. For our European customers, GDPR requires end-to-end encryption key rotation every 30 days and local Frankfurt data residency. If we ship without EU region locks, we risk a delay with our Fortune 500 pilots.",
        highlightType: 'risk',
        highlightNote: 'Compliance Risk: Frankfurt data residency & 30-day key rotation mandatory for EU pilots'
      },
      {
        id: 'tr-8',
        speakerId: 'spk-7',
        speakerName: 'James Wright',
        speakerRole: 'Growth Marketing Director',
        speakerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#14b8a6',
        startTime: 301,
        endTime: 350,
        text: "Question for Marcus and Sarah: For the launch campaign on Product Hunt and TechCrunch, are we highlighting the 8-person real-time notetaker as our hero feature, or the custom AI template generator?",
        highlightType: 'question',
        highlightNote: 'Marketing Strategy: Hero positioning choice between 8-person calls vs Custom AI Templates'
      },
      {
        id: 'tr-9',
        speakerId: 'spk-1',
        speakerName: 'Sarah Chen',
        speakerRole: 'VP of Product (Host)',
        speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#3b82f6',
        startTime: 351,
        endTime: 410,
        text: "Great question James. Both! Our positioning is: 'The AI Notetaker built for high-stakes, multi-speaker meetings.' We demonstrate how Fathom effortlessly tracks an 8-person hour-long executive meeting, extracts precise ownership, and creates custom summaries in seconds.",
        highlightType: 'insight',
        highlightNote: 'Product Positioning: High-stakes, multi-speaker meetings with precision action extraction'
      },
      {
        id: 'tr-10',
        speakerId: 'spk-2',
        speakerName: 'Alex Rivera',
        speakerRole: 'Lead Architect',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#10b981',
        startTime: 411,
        endTime: 470,
        text: "I'll take the action item to coordinate with Jordan's security team. We will spin up an isolated AWS Frankfurt region cluster by next Wednesday to guarantee full EU data sovereignty.",
        highlightType: 'action',
        highlightNote: 'Alex Rivera: Provision AWS Frankfurt region cluster by next Wednesday'
      }
    ],
    summaries: {
      executive: {
        id: 'executive',
        name: 'Executive Summary',
        icon: 'Crown',
        description: 'High-level decision points, ARR impact, and executive takeaways',
        overview: 'The cross-functional leadership team reviewed Q4 product readiness, technical performance milestones, and enterprise security requirements. The release is target-locked for November 15, directly driving $1.4M in pipeline ARR.',
        keyTakeaways: [
          'Nov 15 launch target confirmed to unlock $1.4M ARR enterprise pipeline across 14 deals.',
          'Audio transcription pipeline achieves 340ms latency benchmark across 8 simultaneous streams.',
          'Frankfurt EU data residency cluster to be provisioned by Alex Rivera by next Wednesday.',
          'UI redesign for multi-speaker transcript grouping increased user satisfaction to 94%.'
        ],
        sections: [
          {
            title: 'Strategic Priorities & ARR Impact',
            items: [
              '14 enterprise prospects awaiting SOC2 Type II certification and multi-speaker summary templates.',
              'Positioning hero campaign focused on high-stakes 8+ participant meetings.',
              'CS reported zero friction on action item link jumps during enterprise pilots.'
            ]
          },
          {
            title: 'Technical & Compliance Roadmap',
            items: [
              'Chunked audio buffer pooling introduced to cut GPU memory overhead by 40%.',
              'AWS Frankfurt isolated cluster setup underway for European GDPR compliance.',
              'End-to-end encryption key rotation automated on a 30-day lifecycle.'
            ]
          }
        ]
      },
      engineering: {
        id: 'engineering',
        name: 'Engineering Tech Sync',
        icon: 'Cpu',
        description: 'Architectural benchmarks, buffer optimization, and deployment tasks',
        overview: 'Deep technical discussion regarding real-time audio indexing, latency optimization, and GPU cluster memory footprint during high-concurrency multi-speaker sessions.',
        keyTakeaways: [
          '340ms glass-to-glass latency achieved on Whisper Large v3 + Deepgram Nova-2 pipeline.',
          'GPU memory pooling reduces peak overhead during overlapping multi-speaker talking turns.',
          'Isolated AWS EU-Central-1 deployment scheduled for deployment next Wednesday.'
        ],
        sections: [
          {
            title: 'Audio Pipeline Benchmarks',
            items: [
              '340ms end-to-end latency across 8 audio channels.',
              'Audio buffer pooling mitigates GPU VRAM spikes during 4+ simultaneous speakers.',
              'Dynamic websocket stream reconnection logic verified under simulated 300ms packet loss.'
            ]
          },
          {
            title: 'Infrastructure & Infrastructure as Code (IaC)',
            items: [
              'Terraform scripts ready for AWS EU-Central-1 cluster deployment.',
              'Automated KMS key rotation pipeline integrated into CI/CD.'
            ]
          }
        ]
      },
      sales: {
        id: 'sales',
        name: 'Sales & Revenue Brief',
        icon: 'TrendingUp',
        description: 'Pipeline value, enterprise feature blockers, and GTM launch dates',
        overview: 'Sales leadership emphasized the critical nature of the November 15 launch date to close $1.4M ARR currently stalled in security clearance.',
        keyTakeaways: [
          '$1.4M in pipeline ARR locked behind SOC2 Type II & EU data residency.',
          '14 enterprise prospects actively testing multi-speaker highlight features.',
          'Joint launch campaign with Marketing planned for mid-November.'
        ],
        sections: [
          {
            title: 'Enterprise Pipeline Status',
            items: [
              'Acme Corp and 13 other accounts pending final compliance greenlight.',
              'Sales team using clip sharing feature to send executive highlights directly to buyers.'
            ]
          }
        ]
      },
      action_items: {
        id: 'action_items',
        name: 'Action Items & Next Steps',
        icon: 'CheckSquare',
        description: 'Assigned owners, deadlines, and timestamped video references',
        overview: 'Direct task list extracted from dialogue commitments across product, engineering, design, and compliance.',
        keyTakeaways: [
          'Alex & Jordan: EU Frankfurt cluster setup by next Wednesday.',
          'David & Alex: GPU memory buffer pooling implementation.',
          'James & Marcus: Hero marketing collateral for 8-person call showcase.'
        ],
        sections: [
          {
            title: 'Immediate Deliverables',
            items: [
              'Alex Rivera: Spin up isolated AWS Frankfurt cluster (Target: Wednesday).',
              'David Kim: Implement chunked audio buffer pooling (Target: Friday).',
              'James Wright: Draft launch copy for TechCrunch & Product Hunt hero campaign.'
            ]
          }
        ]
      }
    },
    actionItems: [
      {
        id: 'act-1',
        task: 'Spin up isolated AWS Frankfurt region cluster for EU GDPR compliance',
        assigneeName: 'Alex Rivera',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Oct 04, 2026',
        completed: false,
        timestamp: 411,
        category: 'Engineering'
      },
      {
        id: 'act-2',
        task: 'Implement chunked audio buffer pooling to reduce GPU memory footprint by 40%',
        assigneeName: 'David Kim',
        assigneeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Oct 06, 2026',
        completed: false,
        timestamp: 121,
        category: 'Engineering'
      },
      {
        id: 'act-3',
        task: 'Draft Product Hunt & TechCrunch hero messaging around 8-person meeting notetaker',
        assigneeName: 'James Wright',
        assigneeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Oct 08, 2026',
        completed: true,
        timestamp: 301,
        category: 'Sales'
      },
      {
        id: 'act-4',
        task: 'Finalize SOC2 Type II audit documentation package for enterprise sales pipeline',
        assigneeName: 'Jordan Lee',
        assigneeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Oct 10, 2026',
        completed: false,
        timestamp: 261,
        category: 'Compliance'
      }
    ],
    clips: [
      {
        id: 'clip-1',
        title: '340ms Audio Transcription Latency Demo',
        startTime: 66,
        endTime: 120,
        creatorName: 'Alex Rivera',
        creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        sharedUrl: 'https://fathom.video/clip/340ms-latency-demo',
        tags: ['Architecture', 'Latency', 'AI Audio']
      },
      {
        id: 'clip-2',
        title: 'Enterprise $1.4M ARR Pipeline Opportunity',
        startTime: 25,
        endTime: 65,
        creatorName: 'Marcus Brody',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        sharedUrl: 'https://fathom.video/clip/1.4m-pipeline-arr',
        tags: ['Sales', 'ARR', 'Pipeline']
      }
    ]
  },
  {
    id: 'mtg-enterprise-sales-acme',
    title: 'Enterprise Sales Discovery & Security Clearance - Acme Corp',
    date: '2026-09-28T15:30:00Z',
    durationSeconds: 1680, // 28 minutes
    durationFormatted: '28m 00s',
    platform: 'Google Meet',
    organizer: 'Marcus Brody',
    status: 'Recorded',
    tags: ['Sales', 'Enterprise', 'Acme Corp', 'SOC2'],
    videoThumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80',
    speakers: [
      { id: 'spk-m1', name: 'Marcus Brody', role: 'Director of Sales @ Fathom', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', color: '#f59e0b', talkTimeSeconds: 756, talkPercentage: 45 },
      { id: 'spk-m2', name: 'Rachel Adams', role: 'CTO @ Acme Corp', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', color: '#3b82f6', talkTimeSeconds: 588, talkPercentage: 35 },
      { id: 'spk-m3', name: 'John Miller', role: 'Head of Information Security', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80', color: '#10b981', talkTimeSeconds: 336, talkPercentage: 20 }
    ],
    transcript: [
      {
        id: 'tr-acme-1',
        speakerId: 'spk-m1',
        speakerName: 'Marcus Brody',
        speakerRole: 'Director of Sales @ Fathom',
        speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#f59e0b',
        startTime: 0,
        endTime: 30,
        text: "Hi Rachel and John, excited to meet today. We want to walk through how Fathom AI Notetaker can streamline Acme Corp's 250-person engineering team meeting workflows."
      },
      {
        id: 'tr-acme-2',
        speakerId: 'spk-m2',
        speakerName: 'Rachel Adams',
        speakerRole: 'CTO @ Acme Corp',
        speakerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#3b82f6',
        startTime: 31,
        endTime: 85,
        text: "Hi Marcus. Our main issue currently is engineers spending 5 hours a week in meetings and losing context on key design decisions. We need auto-summaries pushed straight into Notion and Jira.",
        highlightType: 'insight',
        highlightNote: 'Acme Pain Point: Engineers lose 5 hrs/week writing meeting notes; need Notion & Jira sync'
      },
      {
        id: 'tr-acme-3',
        speakerId: 'spk-m3',
        speakerName: 'John Miller',
        speakerRole: 'Head of Information Security',
        speakerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#10b981',
        startTime: 86,
        endTime: 140,
        text: "Before we approve a 250-seat license, I need to verify your data retention policies. Do you train LLM models on our customer call transcripts?",
        highlightType: 'question',
        highlightNote: 'Security Question: Does Fathom train LLMs on customer transcript data?'
      },
      {
        id: 'tr-acme-4',
        speakerId: 'spk-m1',
        speakerName: 'Marcus Brody',
        speakerRole: 'Director of Sales @ Fathom',
        speakerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#f59e0b',
        startTime: 141,
        endTime: 195,
        text: "Zero training! We have zero-data-retention agreements signed with Anthropic and OpenAI. Your call data is encrypted at rest with AES-256 and never used for training.",
        highlightType: 'insight',
        highlightNote: 'Zero Data Retention: Zero LLM model training on customer data guaranteed'
      }
    ],
    summaries: {
      sales: {
        id: 'sales',
        name: 'Sales Discovery Brief (BANT)',
        icon: 'TrendingUp',
        description: 'BANT analysis, technical requirements, and security review status',
        overview: 'Acme Corp CTO Rachel Adams interested in 250 seat deployment to eliminate 5 hours/week engineer note-taking overhead.',
        keyTakeaways: [
          'Deal Size: 250 seats (~$90k ACV).',
          'Key Integration: Notion & Jira automatic action item sync.',
          'Security Greenlight: Zero LLM data retention confirmed by Marcus.'
        ],
        sections: [
          {
            title: 'Budget & Decision Process',
            items: [
              'Budget approved under CTO discretionary engineering tools budget.',
              'Final sign-off pending InfoSec vendor assessment questionnaire.'
            ]
          }
        ]
      }
    },
    actionItems: [
      {
        id: 'act-acme-1',
        task: 'Send InfoSec Security Whitepaper & Zero Data Retention SLA to John Miller',
        assigneeName: 'Marcus Brody',
        assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Sep 30, 2026',
        completed: true,
        timestamp: 141,
        category: 'Sales'
      },
      {
        id: 'act-acme-2',
        task: 'Set up Notion workspace integration sandbox for Acme Corp engineering team',
        assigneeName: 'Elena Rostova',
        assigneeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Oct 02, 2026',
        completed: false,
        timestamp: 31,
        category: 'Product'
      }
    ],
    clips: [
      {
        id: 'clip-acme-1',
        title: 'Zero Data Retention Security Confirmation',
        startTime: 141,
        endTime: 195,
        creatorName: 'Marcus Brody',
        creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        sharedUrl: 'https://fathom.video/clip/zero-data-retention-sla',
        tags: ['Security', 'Infosec', 'Zero-Retention']
      }
    ]
  },
  {
    id: 'mtg-ai-audio-refactor',
    title: 'AI Audio Pipeline & Real-Time Transcription Benchmarks',
    date: '2026-09-27T14:00:00Z',
    durationSeconds: 2100, // 35 minutes
    durationFormatted: '35m 00s',
    platform: 'Zoom',
    organizer: 'Alex Rivera',
    status: 'Recorded',
    tags: ['AI', 'Engineering', 'Architecture', 'Whisper'],
    videoThumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    speakers: [
      { id: 'spk-a1', name: 'Alex Rivera', role: 'Lead Architect', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', color: '#10b981', talkTimeSeconds: 1050, talkPercentage: 50 },
      { id: 'spk-a2', name: 'David Kim', role: 'Sr Backend Engineer', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', color: '#8b5cf6', talkTimeSeconds: 630, talkPercentage: 30 },
      { id: 'spk-a3', name: 'Dr. Aris Thorne', role: 'ML Researcher', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', color: '#ec4899', talkTimeSeconds: 420, talkPercentage: 20 }
    ],
    transcript: [
      {
        id: 'tr-ai-1',
        speakerId: 'spk-a1',
        speakerName: 'Alex Rivera',
        speakerRole: 'Lead Architect',
        speakerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#10b981',
        startTime: 0,
        endTime: 40,
        text: "In this technical deep dive, we are looking at replacing standard WebRTC audio resampling with our custom C++ WebAssembly module in the web browser."
      },
      {
        id: 'tr-ai-2',
        speakerId: 'spk-a3',
        speakerName: 'Dr. Aris Thorne',
        speakerRole: 'ML Researcher',
        speakerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        speakerColor: '#ec4899',
        startTime: 41,
        endTime: 95,
        text: "The WASM module handles 16kHz PCM downsampling on client CPU threads before streaming to our WebSocket server, cutting outbound network payload by 65%.",
        highlightType: 'insight',
        highlightNote: 'WASM Audio Downsampler cuts outbound client bandwidth by 65%'
      }
    ],
    summaries: {
      engineering: {
        id: 'engineering',
        name: 'Engineering Tech Sync',
        icon: 'Cpu',
        description: 'WASM audio pipeline optimization details',
        overview: 'Client-side WASM downsampler reduces client bandwidth by 65% while maintaining 99.4% word error rate accuracy.',
        keyTakeaways: [
          'Client-side WASM downsampling reduces payload bandwidth by 65%.',
          'Word Error Rate (WER) remains rock solid at 0.6% error.'
        ],
        sections: [
          {
            title: 'WASM Optimization',
            items: [
              'Compiled Rust/C++ SIMD module running in web browser audio worker threads.'
            ]
          }
        ]
      }
    },
    actionItems: [
      {
        id: 'act-ai-1',
        task: 'Publish npm package `@fathom/audio-wasm-resampler` for client SDK',
        assigneeName: 'Dr. Aris Thorne',
        assigneeAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        dueDate: 'Oct 01, 2026',
        completed: true,
        timestamp: 41,
        category: 'Engineering'
      }
    ],
    clips: []
  }
];

export const UPCOMING_MEETINGS = [
  {
    id: 'up-1',
    title: 'Sprint Demo & Release Planning (8 Participants)',
    time: 'Today, 2:30 PM',
    duration: '45m',
    platform: 'Zoom',
    organizer: 'Sarah Chen',
    botStatus: 'Joining Auto',
    attendeesCount: 8
  },
  {
    id: 'up-2',
    title: 'Fathom AI x Microsoft Teams Integration Sync',
    time: 'Tomorrow, 11:00 AM',
    duration: '30m',
    platform: 'Microsoft Teams',
    organizer: 'Alex Rivera',
    botStatus: 'Joining Auto',
    attendeesCount: 4
  },
  {
    id: 'up-3',
    title: 'Customer Advisory Board Q4 Roundtable',
    time: 'Oct 02, 4:00 PM',
    duration: '60m',
    platform: 'Google Meet',
    organizer: 'Elena Rostova',
    botStatus: 'Joining Auto',
    attendeesCount: 12
  }
];
