# NextDestination — Design Document (Project 2)

## Project description
NextDestination is a simple full-stack web app for travelers to manage trip plans and memories.
Core idea: a central place to manage the transition from a “dream trip” to a “finished memory.”

### Tech stack / constraints
- Backend: Node.js + Express
- Database: MongoDB (official driver)
- Frontend: HTML5 + Vanilla ES6 Modules + client-side rendering
- Constraints satisfied:
  - No React
  - No Mongoose
  - No server-side rendering / template engines

## Members
- Yazi Zhang (Destinations & Discovery story)
- Jianyu Qiu (Travel Journal & Insights story)

## User Personas
### Yazi (Planner)
Loves planning and wants a clear list of future trips with budgets, search, and editing.

### Jianyu (Journaler)
Wants a private space to record ratings and short reviews to remember details after a trip.

### Luna (Frequent traveler)
Needs separation between planned vs visited, plus simple stats like total places visited.

## User Stories

### Destinations & Discovery (Yazi)
1. Create: add a destination with name, description, budget.
2. Browse/Search: search planned destinations to pick the next trip.
3. Update: edit details because plans change.
4. Delete: remove a destination if no longer interested.

### Travel Journal & Insights (Jianyu)
1. Convert: move a planned destination to “Completed” with one click.
2. Review: give a star rating + short review for finished trips.
3. Filter: toggle views or filter journal entries to focus.
4. Stats: see simple summary like total visited places.

## Design mockups (wireframes)

### Home
- Buttons/links: Bucket List, Travel Journal
- Quick stats: planned count, visited count, avg rating, planned budget sum
- Short “How to use” instructions

### Bucket List page
- Form: add destination (name/description/budget)
- Search bar
- List of destination cards with buttons: Edit / Delete / Complete

### Journal page
- Filter (e.g., min rating)
- List of journal entries with Edit / Delete
- Stats summary (visited count, avg rating)
