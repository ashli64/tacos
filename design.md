# System Blueprint (_a.k.a._ "Design Doc")

## TNPG: TACOS
## project: P05 Le Fin
## Target ship date: {2026-05-30}

---

#### roster:


| Name | Email | Primary Role | Secondary Role |
|---|---|---|---|
|Ashley Li|ashleyl503@nycstudents.net|PM| - |
|Naomi Kurian|naomik30@nycstudents.net|Primary VM| - |
|Isabel Zheng|isabelz13@nycstudents.net|Secondary VM| - |
|Veronika Duvanova|veronikad7@nycstudents.net|Tertiary VM|Scribe|

---


# Summary
We are creating a collaborative recipe sharing application where a user can share their recipes as well as find recipes based on the foods they have at home.

## Problem Being Solved
The problem being solved is the difficulty of finding recipes that you're able to follow with the ingredients you have at hand.

## Target Users

Who will use this system?

- Beginner level cooks
- People with limited access to food products
- Intermediate level cooks looking to share their recipes


## Why This Project Matters
This project makes cooking accessible to anyone who wants to experiment with a new recipe or produce something out of the ingredients they have accessible to them with minimal to no food shopping needed.

---

# Minimum Viable Product (MVP) Scope

## Core Features (Required for Final Submission)
Features that **must** be completed:
1. The ability to post/share a recipe
1. The ability to browse all recipes
1. The ability to search up specific recipes based on recipe title / ingredients

## Stretch Features (Only if MVP is Complete)
1. The ability to have a profile and see your shared / saved recipes
1. A game / something entertaining for the user to do
1. Use of API for imagery

## Explicit Non-Goals

Features intentionally excluded:
- Direct communication between users

---

# Technology Stack

| Layer | Selected Tool |
|---|---|
| Backend Framework | Flask |
| Frontend Framework | Tailwind |
| Database | SQLite |
| Authentication | Flask sessions |
| ORM / DB Library | n/a |

## Why This Stack Was Chosen
We chose flask because it provides smooth transition between app calls, selected tailwind because we have higher familiarity with the framework, selected SQLite because it serves our purpose well (recipes don't require complex database).

---

# Team Ownership Plan

Each member must own meaningful deliverables.

| Team Member | Primary Ownership | Secondary Ownership | Specific Deliverables |
|---|---|---|---|
|Ashley|Frontend|Visual Design| |
|Naomi|Backend| | |
|Isabel|Backend| | |
|Veronika|Backend|Visual Design| |

---

# Component map

{Insert your mermaid(or equivalent)-generated diagram here}

# Site map

{Insert your mermaid(or equivalent)-generated diagram here}
eg...
```
Landing Page
   ↓
Login / Register
   ↓
Dashboard
   ├── Feature A
   ├── Feature B
   └── Profile
```

## Key User Stories
### eg0
As a __________, I want to __________ so that...

### eg1
As a __________, I want to __________ so that...

### eg2
As a __________, I want to __________ so that...



# Database Design

{Insert your table/document organizational structure here}


# Testing Plan
{Delineate here your plan for testing each component}

# Timeline
## Week 1 Goals:
## Week 2 Goals:
## Week 3 Goals:
## Internal Deadlines:
{List milestones your team has identified, in the order they must be completed. Set a target completion date for each.}


# Completion Criteria (_a.k.a._ "Definition of 'Done'")
Project is considered complete when all of the following are true:
1.
1.
1.

# Open Questions
{Delineate anything undecided here}

# Appendix
{Any relevant info that is useful but would have interrupted narrative flow above, or cluttered the information portrayed}

# Other
{Put here anything that did not sensibly fit under above headings. This section will inform evolution of SoftDev.}
