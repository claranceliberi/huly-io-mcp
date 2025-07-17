import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { HulyClient } from '../utils/huly-client.js';
import { logger } from '../utils/logger.js';

/**
 * Register all MCP prompts with the server
 */
export async function registerPrompts(server: Server, hulyClient: HulyClient): Promise<void> {
  logger.info('Registering MCP prompts...');
  
  // List available prompts
  server.setRequestHandler('prompts/list', async () => {
    return {
      prompts: [
        {
          name: 'task_creation',
          description: 'Template for creating well-structured tasks',
          arguments: [
            {
              name: 'project_name',
              description: 'Name of the project',
              required: true,
            },
            {
              name: 'task_type',
              description: 'Type of task (feature, bug, improvement, etc.)',
              required: false,
            },
          ],
        },
        {
          name: 'sprint_planning',
          description: 'Template for sprint planning sessions',
          arguments: [
            {
              name: 'sprint_number',
              description: 'Sprint number or identifier',
              required: true,
            },
            {
              name: 'team_name',
              description: 'Name of the team',
              required: false,
            },
          ],
        },
        {
          name: 'project_status',
          description: 'Template for project status reports',
          arguments: [
            {
              name: 'project_name',
              description: 'Name of the project',
              required: true,
            },
            {
              name: 'period',
              description: 'Reporting period (week, month, quarter)',
              required: false,
            },
          ],
        },
        {
          name: 'meeting_notes',
          description: 'Template for meeting notes and action items',
          arguments: [
            {
              name: 'meeting_type',
              description: 'Type of meeting (standup, planning, retrospective, etc.)',
              required: true,
            },
            {
              name: 'participants',
              description: 'Meeting participants',
              required: false,
            },
          ],
        },
      ],
    };
  });

  // Handle prompt requests
  server.setRequestHandler('prompts/get', async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      switch (name) {
        case 'task_creation': {
          const projectName = args?.project_name || 'Project';
          const taskType = args?.task_type || 'task';
          
          return {
            description: `Create a ${taskType} for ${projectName}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please help me create a well-structured ${taskType} for the ${projectName} project. 

The task should include:
- A clear and concise title
- Detailed description of what needs to be done
- Acceptance criteria or definition of done
- Priority level (low, medium, high, urgent)
- Estimated effort or complexity
- Any dependencies or related tasks
- Due date if applicable

Please ask me for any additional information needed to create a comprehensive task.`,
                },
              },
            ],
          };
        }
        
        case 'sprint_planning': {
          const sprintNumber = args?.sprint_number || 'Next Sprint';
          const teamName = args?.team_name || 'the team';
          
          return {
            description: `Sprint planning template for ${sprintNumber}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Let's plan ${sprintNumber} for ${teamName}. Please help me organize the sprint planning session.

We should cover:
- Sprint goal and objectives
- Available capacity and team velocity
- Backlog prioritization
- Task breakdown and estimation
- Risk assessment and mitigation
- Sprint commitment and deliverables
- Dependencies and blockers

Please guide me through each section and help create a comprehensive sprint plan.`,
                },
              },
            ],
          };
        }
        
        case 'project_status': {
          const projectName = args?.project_name || 'Project';
          const period = args?.period || 'this period';
          
          return {
            description: `Project status report for ${projectName}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please help me create a comprehensive status report for ${projectName} covering ${period}.

The report should include:
- Executive summary
- Key accomplishments and milestones
- Progress against goals and timelines
- Current sprint/iteration status
- Team performance metrics
- Risks and issues
- Budget and resource utilization
- Next steps and upcoming priorities
- Recommendations and action items

Please analyze the project data and create a detailed status report.`,
                },
              },
            ],
          };
        }
        
        case 'meeting_notes': {
          const meetingType = args?.meeting_type || 'meeting';
          const participants = args?.participants || 'team members';
          
          return {
            description: `Meeting notes template for ${meetingType}`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Please help me create structured notes for this ${meetingType} with ${participants}.

The notes should include:
- Meeting details (date, time, participants)
- Agenda items and discussion points
- Key decisions made
- Action items with owners and due dates
- Next steps and follow-up tasks
- Parking lot items or future considerations
- Summary and key takeaways

Please provide a template and help organize the meeting information effectively.`,
                },
              },
            ],
          };
        }
        
        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    } catch (error) {
      logger.error('Error getting prompt:', error);
      throw error;
    }
  });
  
  logger.info('MCP prompts registered successfully');
}