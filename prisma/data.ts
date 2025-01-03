import { ChannelType, Gender, GroupType } from "@prisma/client"

import { generateInviteCode } from "@/lib/utils"

export const users = [
  {
    username: "john_doe",
    email: "john@example.com",
    profile: {
      name: "John Doe",
      gender: Gender.MALE,
      bio: "Software Engineer",
    },
  },
  {
    username: "jane_doe",
    email: "jane@example.com",
    profile: {
      name: "Jane Doe",
      gender: Gender.FEMALE,
      bio: "UI/UX Designer",
    },
  },
  {
    username: "jimmy_smith",
    email: "jimmy@example.com",
    profile: {
      name: "Jimmy Smith",
      gender: Gender.MALE,
      bio: "Full Stack Developer",
    },
  },
  {
    username: "jenny_jones",
    email: "jenny@example.com",
    profile: {
      name: "Jenny Jones",
      gender: Gender.FEMALE,
      bio: "Quality Assurance Engineer",
    },
  },
  {
    username: "sam_williams",
    email: "sam@example.com",
    profile: {
      name: "Sam Williams",
      gender: Gender.MALE,
      bio: "Devops Engineer",
    },
  },
  {
    username: "lisa_taylor",
    email: "lisa@example.com",
    profile: {
      name: "Lisa Taylor",
      gender: Gender.FEMALE,
      bio: "Data Scientist",
    },
  },
  {
    username: "michael_brown",
    email: "michael@example.com",
    profile: {
      name: "Michael Brown",
      gender: Gender.MALE,
      bio: "Product Manager",
    },
  },
  {
    username: "emily_davis",
    email: "emily@example.com",
    profile: {
      name: "Emily Davis",
      gender: Gender.FEMALE,
      bio: "Technical Writer",
    },
  },
  {
    username: "david_miller",
    email: "david@example.com",
    profile: {
      name: "David Miller",
      gender: Gender.MALE,
      bio: "Solutions Architect",
    },
  },
  {
    username: "sarah_wilson",
    email: "sarah@example.com",
    profile: {
      name: "Sarah Wilson",
      gender: Gender.FEMALE,
      bio: "Product Designer",
    },
  },
  {
    username: "james_anderson",
    email: "james@example.com",
    profile: {
      name: "James Anderson",
      gender: Gender.MALE,
      bio: "Frontend Developer",
    },
  },
  {
    username: "karen_thomas",
    email: "karen@example.com",
    profile: {
      name: "Karen Thomas",
      gender: Gender.FEMALE,
      bio: "Backend Developer",
    },
  },
]

export const groups = [
  {
    name: "Tech Enthusiasts",
    description:
      "A group for tech lovers to share and discuss the latest in technology",
    type: GroupType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "UI/UX Designers",
    description:
      "A collaborative space for UI/UX designers to showcase their work",
    type: GroupType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Full Stack Developers",
    description:
      "Dedicated group for full stack developers to discuss project challenges",
    type: GroupType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Quality Assurance Professionals",
    description:
      "A group for QA professionals to share testing strategies and tools",
    type: GroupType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
  {
    name: "DevOps Engineers",
    description:
      "A place for DevOps engineers to discuss automation and CI/CD pipelines",
    type: GroupType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Data Science Enthusiasts",
    description:
      "A community for data scientists to share insights and projects",
    type: GroupType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Product Management Gurus",
    description:
      "Focused group for product managers to share their experiences and strategies",
    type: GroupType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Technical Writers Community",
    description:
      "A supportive group for technical writers to improve and share their work",
    type: GroupType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Solutions Architects Hub",
    description:
      "A hub for solutions architects to discuss architecture best practices",
    type: GroupType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Product Designers Collective",
    description:
      "Collective for product designers to brainstorm and critique designs",
    type: GroupType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
]

export const channels = [
  {
    name: "Tech Talk",
    description: "A space for tech enthusiasts to discuss trends and news",
    type: ChannelType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Casual Chat",
    description: "A relaxed place for informal conversations",
    type: ChannelType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Community Announcements",
    description: "Official announcements and updates from the community",
    type: ChannelType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Welcome Lounge",
    description: "Introduce yourself and meet other community members",
    type: ChannelType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Feedback Hub",
    description: "Share your feedback and suggestions for improvements",
    type: ChannelType.PUBLIC,
    inviteCode: generateInviteCode(),
  },
  {
    name: "Idea Exchange",
    description: "Exchange ideas and suggestions with fellow members",
    type: ChannelType.PRIVATE,
    inviteCode: generateInviteCode(),
  },
]
