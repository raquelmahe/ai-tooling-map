# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The primary users are Design Infrastructure practitioners maintaining and evaluating the Product Design AI capability portfolio. Design leaders and cross-functional partners are secondary readers of portfolio and measurement views.

## Product Purpose

This is a decision-support prototype for testing an evidence-based model of Product Design AI tooling. It connects a maintainable capability register, a workflow and lifecycle landscape map, and a measurement dashboard so practitioners can assess where capabilities sit, what is known about them, and what portfolio action may be appropriate.

Success means the prototype helps users make better-informed decisions to investigate, pilot, scale, integrate, improve, consolidate, or retire capabilities. Adopting more tools is not an outcome by itself.

## Positioning

The product connects three levels of portfolio reasoning in one traceable model: detailed capability records create the landscape view, the landscape reveals portfolio decisions, and the dashboard tests whether those decisions produce measurable value. It distinguishes capability activity and adoption from workflow, quality, delivery, and business outcomes.

## Operating Context

Practitioners review AI tools, embedded AI features, automations, agents, skills, training, processes, standards, and infrastructure across the Product Design lifecycle: Source, Create, Review, Deliver, and Learn.

Capabilities are also located within Product Design workflows and connected workstreams. Reviews consider ownership, governance, privacy and security, accessibility, provenance, human review, reversibility, Backpack connections, maturity, approval status, and available evidence.

The prototype currently runs as a client-side static web application. New capabilities added through the interface exist only for the current page session; persistence and automated data feeds are undecided.

## Capabilities and Constraints

- Provide a capability register with search and filters for approval status, maturity, and evidence state.
- Map capabilities by Product Design workflow and lifecycle stage, explicitly showing capability gaps.
- Show capability details and allow a practitioner to add a capability using labelled unknown values where evidence is absent.
- Connect capability investments and adoption signals to workflow, quality, delivery, and business outcome measures without implying causation.
- Keep unknown owners, approvals, baselines, targets, data sources, usage, costs, and outcomes explicitly labelled. Never fabricate evidence or present illustrative records as confirmed facts.
- Treat current records marked as examples or unconfirmed observations accordingly until validated with an accountable owner and evidence source.
- Persistence, authentication, permissions, integrations, automated data feeds, and production deployment are open decisions.

## Evidence on Hand

- `js/data.js` contains the lifecycle, workflow, workstream, capability-type, status, maturity, action, and evidence-state models used by the prototype.
- The capability register contains three explicitly illustrative records and one unconfirmed Design Radar observation derived from a screenshot.
- Dashboard measures are placeholders. Confirmed baselines, targets, owners, comparison groups, and data sources are not yet available.
- The repository contains no confirmed testimonials, adoption figures, cost data, business results, or causal evidence; future work must not invent them.

## Product Principles

- Evidence before assertion: clearly separate confirmed facts, observations, examples, assumptions, and unknowns.
- Decisions over inventory: evaluate capabilities by the action and value evidence they enable, not by tool count.
- Traceability across the model: keep register records, landscape placement, and measurement signals connected.
- Human judgement remains accountable: automated or AI-assisted outputs support review rather than replacing ownership and decision rights.
- Measure the chain, not just activity: distinguish adoption from workflow change, quality or delivery outcomes, and business contribution.
