export function buildPriorityRecommendations(context = '') {
  const normalizedContext = context.toLowerCase();
  const priorities = {
    high: [
      'Implement mandatory intake workflow before any operational build begins.',
      'Standardize campaign member statuses and lifecycle transition criteria.',
      'Enforce UTM validation before links are used in campaign assets.',
    ],
    medium: [
      'Add SLA governance for owner assignment, task due dates, and escalation.',
      'Create reporting QA checks for source, status, and attribution completeness.',
      'Document exception handling for partner, customer, or regional process variants.',
    ],
    low: [
      'Add quarterly documentation review cadence with named process owner.',
      'Create enablement notes for downstream teams using the process.',
      'Maintain examples for approved naming, routing, and status values.',
    ],
  };

  if (normalizedContext.includes('webinar')) {
    priorities.high.unshift('Standardize webinar status values for registered, attended, no-show, and follow-up complete.');
    priorities.medium.unshift('Define no-show nurture and attendee routing rules before launch.');
  }

  if (normalizedContext.includes('bdr') || normalizedContext.includes('sales')) {
    priorities.high.push('Define MQL to SAL handoff rules and BDR follow-up SLA before activation.');
  }

  return priorities;
}

export function buildWorkflowLogic(context = '') {
  const normalizedContext = context.toLowerCase();
  const workflows = [
    {
      name: 'Intake Validation Workflow',
      trigger: 'Request form submitted or process status moves to requested.',
      logic: 'Require owner, audience, campaign, region, channel, due date, and CTA fields before build can start.',
      outcome: 'Prevents incomplete requests from entering operations queue.',
    },
    {
      name: 'Attribution QA Workflow',
      trigger: 'Campaign asset or tracking link is marked ready for QA.',
      logic: 'Validate UTM structure, CRM campaign association, source fields, and campaign member status mapping.',
      outcome: 'Improves attribution consistency before launch.',
    },
    {
      name: 'SLA Task Creation Workflow',
      trigger: 'Qualified engagement or lifecycle stage changes to MQL.',
      logic: 'Create owner task, set due date from SLA rules, suppress duplicates, and escalate overdue tasks.',
      outcome: 'Makes handoff timing measurable and enforceable.',
    },
  ];

  if (normalizedContext.includes('webinar')) {
    workflows.push({
      name: 'Webinar Attendance Routing Workflow',
      trigger: 'Webinar attendance status syncs from the event platform.',
      logic: 'Route target-account attendees to BDR, customers to CSM, no-shows to nurture, and low engagement to marketing nurture.',
      outcome: 'Prevents duplicate follow-up while preserving audience-specific paths.',
    });
  }

  return workflows;
}

export function buildOperationalMaturityInsights(context = '') {
  const normalizedContext = context.toLowerCase();
  const insights = [
    'Governance gap: process quality depends on required fields, controlled values, and clear approval gates.',
    'Process bottleneck: unclear owners or missing SLAs will slow routing and follow-up.',
    'Reporting risk: inconsistent source, status, or campaign association fields will reduce dashboard trust.',
    'Automation opportunity: use triggers, suppression rules, and status updates to reduce manual coordination.',
    'Ownership clarity issue: every process step should have one accountable owner and one backup path.',
  ];

  if (normalizedContext.includes('demandbase')) {
    insights.push('Systems risk: confirm Demandbase and CRM account engagement logic before using influence reporting.');
  }

  return insights;
}
