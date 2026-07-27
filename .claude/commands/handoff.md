You manage per-plan task tracking in a dedicated tasks file that lives next to the plan file.
Your argument (`$ARGUMENTS`) is the path to the active plan file.

Do not run any review, critique, QA, audit, or analysis. Do not read additional files beyond
the plan file and its derived tasks file. Act only on what is in your conversation context
and those two files. Confirm the save and stop.

## Core behavior

- Each plan file gets its own tasks file.
- The tasks file path is derived from the plan path by appending `-tasks.md` before the extension.
  Example:
  - Plan: `/Users/.../.claude/plans/ultrathink-example.md`
  - Tasks: `/Users/.../.claude/plans/ultrathink-example-tasks.md`
- All reads and writes are scoped ONLY to this plan's tasks file.
- Never touch any other plan's tasks file.

## Steps

1. **Resolve the plan path**
   - Your argument is `$ARGUMENTS`. Trim any whitespace.
   - This exact string is the plan path.

2. **Derive the tasks file path**
   - Let `planPath = $ARGUMENTS`.
   - Insert `-tasks` before the `.md` extension.
   - Example: `planPath = /path/to/plan.md` → `tasksPath = /path/to/plan-tasks.md`.

3. **Read or create the tasks file**
   - If `tasksPath` exists, read it in full.
   - If `tasksPath` does not exist, create it with this initial structure:

     ```md
     # Plan: [plan filename only]
     # Started: [today's date, YYYY-MM-DD]
     # Status: IN PROGRESS
     # Last session stopped at: [none yet]

     ## TASKS
     - [ ] (populate from plan)

     ## BLOCKERS
     (none yet)
     ```

   - To populate `## TASKS` on first creation:
     - Read the plan file at `planPath`.
     - Extract every discrete task, step, or action item as an unchecked `- [ ]` line.
     - Preserve obvious hierarchy as subtasks when needed:

       ```md
       - [ ] Parent task
         - [ ] Subtask A
         - [ ] Subtask B
       ```

4. **Update task status (this session only)**

   - Review your conversation context for work completed this session.
   - For each completed item that matches a task in `## TASKS`, change `- [ ]` to `- [x]`.
   - If a task was partially completed and required multiple distinct steps, expand it into
     subtasks under the same parent, marking only the finished subtasks `- [x]`.
   - Do not change the meaning of existing tasks. Do not reorder tasks.

5. **Add new tasks and subtasks for discoveries**

   - If new issues, bugs, or required steps were discovered this session that are NOT already
     present in `## TASKS`, add them as new unchecked `- [ ]` items.
   - Place them under the most relevant parent task as indented subtasks when appropriate.
   - Do not leave any new work only in memory; everything discovered must be written to the
     tasks file.

6. **Record blockers**

   - If anything could not be completed or is blocked:
     - Add a bullet under `## BLOCKERS` with a one-line description of the blocker and,
       if known, the file/area it affects.
   - Do not remove existing blockers unless they were resolved during this session, in which
     case note that they are resolved.

7. **Update the header**

   - Update `# Last session stopped at:` with the name of the last completed task (or
     subtask) from this session.
   - If all tasks in `## TASKS` (and any subtasks) are now `- [x]`, set
     `# Status: COMPLETE`.
   - Otherwise keep or set `# Status: IN PROGRESS`.

8. **Write the tasks file**

   - Write `tasksPath` back to disk with:
     - The header section updated (`Plan`, `Started`, `Status`, `Last session stopped at`).
     - The `## TASKS` section updated with new `[x]` states and any new tasks/subtasks.
     - The `## BLOCKERS` section updated with any new or resolved blockers.

9. **Confirm and stop**

   - After the Write tool returns, reply with one brief sentence confirming the save, including:
     - The plan path (`$ARGUMENTS`)
     - The tasks file path (`tasksPath`)
   - Then stop. Do not continue working on the plan itself in this skill.
