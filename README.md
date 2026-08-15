# Request Triage AI

Build a complete professional B2B SaaS web application called "MaintenanceAI".

IMPORTANT:

Build the entire MVP in one implementation.

Do not require external APIs.

Do not require OpenAI.

Do not require authentication.

Do not require payments.

Use deterministic local mock analysis.

Do not use random AI results.

The application is an AI-assisted maintenance request triage platform for property management companies.

==================================================

PRODUCT

==================================================

Name:

MaintenanceAI

Tagline:

"Turn maintenance requests into actionable work orders."

Target customers:

Property management companies, property managers, landlords and maintenance coordinators.

The application receives maintenance requests and helps classify, prioritize and route them.

Core workflow:

Maintenance request

→ Analyze

→ Category

→ Risk/Priority

→ Problem Summary

→ Recommended Technician

→ Recommended Action

→ Follow-up Questions

→ Safety Assessment

→ Suggested Tenant Response

==================================================

DESIGN

==================================================

Create a polished professional B2B SaaS interface.

Use:

- Light professional background

- Dark text

- Clean typography

- Rounded cards

- Subtle borders

- Subtle shadows

- Professional spacing

- Responsive design

- Desktop sidebar

- Mobile navigation

- Professional tables

- Professional badges

- Professional dashboard

- Clean charts

Do NOT make it look like a chatbot.

All interface text must be in English.

==================================================

PAGES

==================================================

Create:

1. Dashboard

2. Maintenance Requests

3. New Maintenance Request

4. Request Details

5. Analytics

6. Settings

All navigation must work.

No dead buttons.

==================================================

DASHBOARD

==================================================

Show KPI cards:

- Open Requests

- Critical

- High Priority

- Medium

- Resolved Today

Show recent requests table:

Request

Property

Unit

Category

Priority

Status

Created

Action

Statuses:

New

Under Review

Assigned

In Progress

Resolved

Create at least 15 realistic mock requests.

==================================================

NEW MAINTENANCE REQUEST

==================================================

Create a form with:

Property

Unit

Tenant

Description

Category

Priority

Optional image

Properties:

Sunset Apartments

Park View Residences

Downtown Lofts

Riverside Homes

Categories:

HVAC

Plumbing

Electrical

Appliance

Structural

Pest

Other

Priority:

Low

Medium

High

Critical

Add:

Analyze Request

When clicked:

1. Validate required fields.

2. Show loading state for 1–2 seconds.

3. Analyze using deterministic local logic.

4. Display analysis.

5. Never use random results.

6. The same input must always produce the same result.

==================================================

MOST IMPORTANT: ANALYSIS LOGIC

==================================================

Create a reusable deterministic function:

analyzeMaintenanceRequest()

It must receive:

description

selectedCategory

selectedPriority

and return:

category

priority

riskLevel

problemSummary

recommendedAction

technician

followUpQuestions

safetyAssessment

confidence

==================================================

CATEGORY LOGIC

==================================================

IMPORTANT:

Specific terms must take precedence over generic terms.

APPLIANCE must take precedence over generic "cooling".

Appliance keywords:

refrigerator

fridge

freezer

dishwasher

washing machine

washer

dryer

oven

stove

microwave

HVAC keywords:

air conditioner

AC

air conditioning

HVAC

furnace

heater

heating

thermostat

cooling system

Plumbing:

sink

toilet

faucet

pipe

drain

shower

bathtub

water pressure

water leak

Electrical:

outlet

socket

breaker

electrical

electricity

wiring

power

light switch

sparks

smoke

burning smell

Structural:

door

window

roof

ceiling

wall

lock

Pest:

cockroach

roach

rat

mouse

rodent

bed bugs

termite

CATEGORY PRIORITY RULE:

If the user explicitly selected a category, preserve that category unless the description contains a completely incompatible category and there is very strong evidence.

Example:

Selected category = Appliance

Description = "The refrigerator is not cooling."

Result MUST remain:

Appliance

NOT HVAC.

==================================================

RISK / PRIORITY LOGIC

==================================================

This section is extremely important.

Never classify a normal malfunction as Critical.

CRITICAL ONLY when there is an explicit immediate emergency such as:

fire

active fire

smoke

electrical shock

gas leak

gas smell

explosion

life-threatening condition

or another clearly immediate danger to people.

HIGH when there is a serious safety/property risk, including:

burning smell

sparks

exposed live wiring

water leaking near an electrical outlet

water reaching electrical equipment

major flooding

significant active leak causing property damage

serious electrical fault

MEDIUM for normal maintenance failures such as:

refrigerator not cooling

washing machine not starting

dishwasher not draining

AC not cooling

heater not heating

normal sink leak

normal toilet problem

minor appliance malfunction

LOW for:

cosmetic damage

minor paint problems

small non-urgent issues

minor aesthetic defects

VERY IMPORTANT:

These phrases alone MUST NOT create Critical:

"not cooling"

"not heating"

"not working"

"making noise"

"poor performance"

"food getting warm"

"water leak"

A normal refrigerator that is not cooling is:

Appliance

Medium

A washing machine that is not starting is:

Appliance

Medium

An AC that is not cooling is:

HVAC

Medium

A normal sink leak without electrical danger is:

Plumbing

Medium or High depending on severity.

==================================================

SAFETY COMBINATION RULES

==================================================

Combination rules have higher priority than normal category rules.

Example:

"The washing machine is leaking water near an electrical outlet."

Result:

Category:

Appliance

Priority:

High

Risk:

High

Recommended action:

Stop using the appliance and keep away from the affected electrical area. Have a qualified technician inspect it.

Do NOT classify this as Medium.

Another example:

"Water is reaching an electrical outlet."

Result:

Priority:

High

Another:

"Electrical outlet has sparks and burning smell."

Result:

Category:

Electrical

Priority:

High

Another:

"There is an active fire in the electrical panel."

Result:

Category:

Electrical

Priority:

Critical

==================================================

EXACT TEST CASES

==================================================

The application MUST pass all these tests.

TEST 1:

Category:

Appliance

Priority:

Medium

Description:

"The refrigerator is not cooling properly, but there is no smoke, burning smell, sparks, exposed wiring, gas leak, or water leak."

Expected:

Category = Appliance

Priority = Medium

Risk = Medium

==================================================

TEST 2:

Category:

Appliance

Priority:

Medium

Description:

"The washing machine is not starting."

Expected:

Category = Appliance

Priority = Medium

Risk = Medium

==================================================

TEST 3:

Category:

HVAC

Priority:

Medium

Description:

"The AC is running but the apartment is not getting cold."

Expected:

Category = HVAC

Priority = Medium

Risk = Medium

==================================================

TEST 4:

Category:

Plumbing

Priority:

Medium

Description:

"The kitchen sink has a normal water leak."

Expected:

Category = Plumbing

Priority = Medium

Risk = Medium

==================================================

TEST 5:

Category:

Electrical

Priority:

High

Description:

"Several outlets stopped working and the breaker keeps tripping."

Expected:

Category = Electrical

Priority = High

Risk = High

==================================================

TEST 6:

Category:

Electrical

Priority:

High

Description:

"There is a burning smell coming from an electrical outlet."

Expected:

Category = Electrical

Priority = High

Risk = High

==================================================

TEST 7:

Category:

Electrical

Priority:

High

Description:

"There are sparks coming from the electrical outlet."

Expected:

Category = Electrical

Priority = High

Risk = High

==================================================

TEST 8:

Category:

Appliance

Priority:

Medium

Description:

"The washing machine is leaking water near an electrical outlet."

Expected:

Category = Appliance

Priority = High

Risk = High

==================================================

TEST 9:

Category:

Electrical

Priority:

High

Description:

"Water is reaching an electrical outlet."

Expected:

Category = Electrical

Priority = High

Risk = High

==================================================

TEST 10:

Category:

Electrical

Priority:

High

Description:

"There is an active fire inside the electrical panel."

Expected:

Category = Electrical

Priority = Critical

Risk = Critical

==================================================

PROBLEM SUMMARY

==================================================

The summary must describe the actual request.

Never invent information.

Use:

"Possible..."

"Likely..."

"Requires inspection."

Example:

"Possible refrigerator cooling-system issue. The exact cause cannot be confirmed without an inspection."

==================================================

RECOMMENDED TECHNICIAN

==================================================

HVAC:

HVAC technician

Plumbing:

Licensed plumber

Electrical:

Licensed electrician

Appliance:

Appliance technician

Structural:

General maintenance / qualified contractor

Pest:

Pest control technician

==================================================

RECOMMENDED ACTION

==================================================

Give one practical next action.

Never claim the AI has physically diagnosed the problem.

Examples:

Appliance:

"Assign an appliance technician for inspection."

HVAC:

"Assign an HVAC technician to inspect the cooling system."

Plumbing:

"Assign a plumber to inspect the leak."

Electrical:

"Assign a qualified electrician to inspect the affected circuit."

High-risk electrical situation:

"Stop using the affected equipment/circuit and arrange qualified professional inspection."

Critical emergency:

"Escalate immediately and contact appropriate emergency services when necessary."

==================================================

FOLLOW-UP QUESTIONS

==================================================

Generate 2–3 relevant questions.

Appliance:

Is the appliance completely unusable?

Is there any smoke or burning smell?

Is there any water leaking?

HVAC:

Is the system still running?

Is water leaking?

Is there any burning smell?

Plumbing:

Is water still actively leaking?

Where exactly is the leak?

Is the affected area near electrical equipment?

Electrical:

Is there smoke or a burning smell?

Did the breaker trip?

Are sparks visible?

==================================================

SAFETY ASSESSMENT

==================================================

Low/Medium:

"No immediate safety hazard is indicated by the information provided."

High:

"This issue may present a safety or property risk and should be inspected promptly by a qualified professional."

Critical:

"This appears to be an immediate safety emergency. Escalate immediately and contact appropriate emergency services when necessary."

Never invent a safety hazard.

==================================================

CONFIDENCE

==================================================

Confidence must be deterministic.

Use:

90–98%:

Very clear request.

75–89%:

Reasonably clear.

60–74%:

Some ambiguity.

Below 60%:

Very vague.

Never use a random confidence score.

==================================================

TENANT RESPONSE

==================================================

Create:

Suggested Tenant Response

Example:

"Hi John,

Thank you for reporting the maintenance issue.

We've reviewed your request and classified it as a medium-priority appliance issue. A technician will be assigned to inspect it.

We'll keep you updated.

Maintenance Team"

Buttons:

Copy Message

Edit Message

==================================================

REQUEST DETAILS

==================================================

Display:

Request ID

Property

Unit

Tenant

Description

Category

Priority

Risk

Status

Created Date

AI Analysis card:

Problem Summary

Recommended Action

Technician

Follow-up Questions

Safety Assessment

Confidence

Buttons:

Approve

Edit

Assign Technician

Escalate

Resolve

==================================================

TECHNICIANS

==================================================

Create mock technicians:

Mike HVAC

Sarah Plumbing

David Electrical

John Appliance Repair

ABC General Maintenance

Pro Pest Control

Filter recommendation based on category.

==================================================

STATUS

==================================================

New

Under Review

Assigned

In Progress

Resolved

Allow status changes.

==================================================

ANALYTICS

==================================================

Create mock analytics:

Total Requests

Critical Requests

High Priority Requests

Average Response Time

Average Resolution Time

Resolution Rate

Charts:

Requests by Category

Requests by Priority

Requests Over Time

==================================================

SETTINGS

==================================================

Company Information:

Company Name

Contact Email

Maintenance:

Default Priority

Emergency Escalation

AI:

Automatic Categorization

AI Generated Tenant Responses

==================================================

MOCK DATA

==================================================

Create at least 15 realistic requests covering:

HVAC

Plumbing

Electrical

Appliance

Structural

Pest

Include different priorities and statuses.

==================================================

IMAGE UPLOAD

==================================================

Allow image selection and preview.

Do not analyze the image with an external API.

Show:

"Image uploaded for technician review."

Never claim that the image has confirmed a diagnosis.

==================================================

ERROR HANDLING

==================================================

Required fields:

Property

Unit

Tenant

Description

Show clear validation messages.

Never silently fail.

==================================================

MOBILE

==================================================

Everything must work on mobile.

Forms must be easy to use.

Tables should become responsive cards or scroll horizontally.

==================================================

FINAL REQUIREMENT

==================================================

Before considering the project complete, internally verify all 10 test cases above.

Most important:

1. Refrigerator not cooling = Appliance + Medium.

2. Washing machine not starting = Appliance + Medium.

3. AC not cooling = HVAC + Medium.

4. Water near electricity = High.

5. Burning smell = High.

6. Sparks = High.

7. Active electrical fire = Critical.

8. Never classify a normal appliance malfunction as Critical.

9. Never use random results.

10. Keep category and risk logic consistent.

Build the complete prototype in one implementation.

Do not leave Lorem Ipsum.

Do not leave broken buttons.

Do not require external services.

Do not add unnecessary features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19e773ee-6bfb-497f-b4e5-7bef3c891667).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
