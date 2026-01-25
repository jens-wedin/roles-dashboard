

This tutorial assumes that you are familiar with Google Antigravity, an agentic platform that evolves the IDE into an agent-first paradigm. The platform is fully capable of running agents in parallel, that can reason and executes tasks on behalf of the user, powered by state of the art reasoning models like Gemini.

If you are looking to get started with Antigravity, please refer to this tutorial:

Tutorial : Getting Started with Google Antigravity
Welcome to the tutorial on Antigravity, Google’s free and experimental Agent first development platform.
medium.com

If you’d prefer to do a codelab instead, check out the two-part codelabs:

Getting Started with Google Antigravity
Building with Google Antigravity
Why Skills?
If you’d prefer to learn about Google Antigravity Skills via a step-by-step codelab, please go here.

Getting Started with Skills in Google Antigravity | Google Codelabs
The codelab covers Antigravity Skills, a lightweight, open format for extending AI agent capabilities with specialized…
codelabs.developers.google.com

Before we dive into Skills and what the reasoning behind them is, let’s understand how we got here?

If you step back a bit and look at Google Antigravity and similar AI Agentic platforms out there, you will know that these platforms are not just a listener executing rigid commands, but a reasoner capable of interpreting intent, planning multi-step workflows, and executing complex tasks with a degree of autonomy.

To do that, it needs to have what is known as the context. The context needs to be aware of the local file system, understands project structure, and executes commands on behalf of the user. Additionally, we have extended the capabilities of these Agentic platforms by integrating MCP servers (which expose tools) that allow for grounding of the responses with your own data as well as integration with external systems.

That brings us to Context Saturation. While modern models like Gemini 2.5/3 boast context windows exceeding one million tokens , the indiscriminate loading of an entire codebase, documentation library, and toolset into the model’s active memory creates significant latency and financial overhead, not to mention context rot, which results in sub-optimal reasons due to the model getting confused.

Kurtis Van Gent
 covers the Tool Bloat Epidemic well in the article titled “Stop Drowning Your Agent in Tools”.

The Tool Bloat Epidemic
Strategies for combating tool bloat to improve agent accuracy, latency, and cost
medium.com

I summarize a few points from the article. Consider the sheer amount of tools that we are loading the Agent with. Examples include GitHub MCP Server (50 Tools), Playwright MCP Server (24 tools) and Chrome DevTools MCP Server (26 tools). The problem is that we have loaded the agents with 100s of tools, consuming 40–50K of tokens, sending it a prompt that may end up using only one tool. You get the picture now about Tool Bloat, Agent confusion, Context Rot, Latency and more.

Let’s take a real example: A developer asking an agent to “refactor the authentication middleware” requires deep knowledge of specific security protocols and file structures but does not require the context of the project’s CSS build pipeline or marketing assets.

Anthropic introduces Skills
To address this, Anthropic proposed a new standard: Agent Skills. As per the definition:

Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows.

Skills represent a shift from monolithic context loading to Progressive Disclosure. Rather than forcing the model to “memorize” every possible capability at the start of a session, Skills allow the developer to package specialized expertise — such as database migration protocols, security auditing workflows, or specific code review standards — into modular, discoverable units (skills).

This is key → The model is exposed only to a lightweight “menu” of these capabilities (metadata) and loads the heavy procedural knowledge (instructions and scripts) only when the user’s intent matches a specific skill. This avoids the tool bloat, keeps the context to a minimum and is good economics too.

The image below should help understand what happens:

Press enter or click to view image in full size

Agent Skills and Antigravity
Given that we are dealing with Antigravity, where does a “Skill” fit in its architecture? If the Agent Manager is the brain and the Editor is the canvas, Skills are the specialized training modules. By default, an agent knows general programming (thanks to the underlying Gemini 3 model) and basic tool use (terminal, file I/O). However, it does not know your specific context.

A Skill acts as a bridge. It is a defined set of instructions and capabilities that an agent can “equip” to handle specific types of requests. When a user asks an agent to “run a database migration,” the agent scans its available Skills (Global or Workspace specific). If it finds a database-migration skill, it loads those specific instructions and execution protocols into its context window. This allows the agent to perform the task not just correctly in a general sense, but correctly according to the specific standards and safety protocols defined by the engineering team.

Skills effectively turn the generalist Gemini model into a specialist. They allow an organization to codify its best practices (security checks, code style preferences, deployment steps) into executable assets that the AI follows rigorously.

Let’s now dive into what a skill is composed off, defining it with the context of the Antigravity tool.

Antigravity Skills: Concepts and Distinction
The official documentation for Antigravity Skills is here: https://antigravity.google/docs/skills

It is critical to precisely define what a Skill is within Antigravity and how it differs from adjacent concepts like Rules, Workflows, and MCP Servers.

Disclaimer: While documentation on this is sparse and I suspect that we might see some clarity emerge in the short term around best practices within Antigravity around Skills v/s using Rules/Workflows and integrating them well with MCP Servers. I could be wrong in some of the points that I highlight and will appreciate feedback.

What is a Skill?
In the context of Google Antigravity, a Skill is a directory-based package containing a definition file (SKILL.md) and optional supporting assets (scripts, references, templates). It is a mechanism for on-demand capability extension.

On-Demand: Unlike a System Prompt (which is always loaded), a Skill is only loaded into the agent’s context when the agent determines it is relevant to the user’s current request. This optimizes the context window and prevents the agent from being distracted by irrelevant instructions. In large projects with dozens of tools, this selective loading is crucial for performance and reasoning accuracy.
Capability Extension: Skills can do more than just instruct; they can execute. By bundling Python or Bash scripts, a Skill can give the agent the ability to perform complex, multi-step actions on the local machine or external networks without the user needing to manually run commands. This transforms the agent from a text generator into a tool user.
Skills vs. Model Context Protocol (MCP)
One of the most common points of confusion is the difference between Skills and the Model Context Protocol (MCP). Both extend the agent’s capabilities, but they solve different problems via different architectures.

Antigravity Skills are best understood as lightweight, ephemeral task definitions. They are serverless and file-based. When a skill is invoked, the agent reads the instructions and potentially executes a script. Once the task is done, the skill’s context is released. This makes them ideal for ad-hoc engineering tasks like “Generate a changelog,” “Run a specific test suite,” or “Format code”. They require no persistent infrastructure and can be version-controlled alongside the code they operate on.

Model Context Protocol (MCP), on the other hand, is a heavy-duty interoperability standard. It involves a client-server architecture where the IDE connects to a running server process. MCP is designed for stateful connections to external systems like PostgreSQL databases, GitHub repositories, or Slack workspaces. The MCP server maintains a persistent connection, manages authentication state, and exposes a dynamic set of tools and resources to the agent. While powerful, this introduces operational overhead: memory consumption for running processes, port management, and lifecycle complexity.

The “Skills” Philosophy: Skills represent a shift toward “less infrastructure, more intelligence.” Instead of maintaining a complex mesh of microservices just to let an AI read a database schema, a Skill can simply contain a script that connects, reads, and disconnects. This ephemeral nature makes Skills ideal for the vast majority of local development tasks where persistent connections are unnecessary overhead.

Here is a way to understand them better:

MCP Tools are the Hands: They are deterministic functions like read_file, execute_query, or search_web.
Skills are the Brains: They are the methodology that tells the agent how and when to use those tools.
A Database Migration Skill (Methodology) might guide the agent to use the Postgres MCP Tool (Function) to run a specific command.

Skills vs. Rules and Workflows
Antigravity also features “Rules” and “Workflows.” Understanding the distinction is vital for proper system design.

Rules (.agent/rules/): These are passive constraints. They are always "on" (or triggered by file type) and are injected into the system prompt to govern behavior. Use Rules for things the agent must always do, like "Always use TypeScript strict mode" or "Never commit secrets." They restrict the how of every task. They are the guardrails of the system.
Workflows (.agent/workflows/): These are active, user-triggered sequences. A workflow is a saved prompt or set of steps that the user explicitly invokes (e.g., /test or /review). They are useful for manual orchestration, allowing developers to trigger complex, multi-step processes with a single command. They are the macros of the agentic world.
Skills: These sit in the middle. They are agent-triggered capabilities. The user does not need to type /skill-name. Instead, the user states a goal ("Check the database for user X"), and the agent's reasoning engine identifies that the database-query Skill is relevant and activates it. Skills are best for distinct tools or capabilities that the agent needs access to but shouldn't use all the time. They allow for a more natural, conversational interface where the user focuses on the what and the agent figures out the how.
Things get interesting here
While distinct, we are living in interesting times and can potentially look at using these together.

A common pattern might involve Rule that enforces the use of a specific Skill. For example, a global rule might state: “When the user asks for a database change, you MUST use the safe-db-migration skill." This ensures that the agent doesn't attempt to write raw SQL directly into the terminal, bypassing the safety checks embedded in the skill's script.

Similarly, a Workflow might invoke a Skill as one of its steps. A /deploy workflow might call the build skill, followed by the test skill, and finally the push-to-cloud skill. This composability allows for the creation of sophisticated, robust automation pipelines which are still flexible enough for real-world development.

Creating Skills
Creating a Skill in Antigravity follows a specific directory structure and file format. This standardization ensures that skills are portable and that the agent can reliably parse and execute them. The design is intentionally simple, relying on widely understood formats like Markdown and YAML, lowering the barrier to entry for developers wishing to extend their IDE’s capabilities.

Directory Structure
Skills can be defined at two scopes, allowing for both project-specific and user-specific customizations :

Workspace Scope: Located in <workspace-root>/.agent/skills/. These skills are available only within the specific project. This is ideal for project-specific scripts, such as deployment to a specific environment, database management for that app, or generating boilerplate code for a proprietary framework.
Global Scope: Located in ~/.gemini/antigravity/skills/. These skills are available across all projects on the user's machine. This is suitable for general utilities like "Format JSON," "Generate UUIDs," "Review Code Style," or integration with personal productivity tools.
A typical Skill directory looks like this :

my-skill/ 
├── SKILL.md # The definition file 
├── scripts/ # [Optional] Python, Bash, or Node scripts 
    ├── run.py 
    └── util.sh 
├── references/ # [Optional] Documentation or templates 
    └── api-docs.md 
└── assets/ # [Optional] Static assets (images, logos)
This structure separates concerns effectively. The logic (scripts) is separated from the instruction (SKILL.md) and the knowledge (references), mirroring standard software engineering practices.

The SKILL.md Definition File
The SKILL.md file is the brain of the Skill. It tells the agent what the skill is, when to use it, and how to execute it.

It consists of two parts:

YAML Frontmatter
Markdown Body.
YAML Frontmatter

This is the metadata layer. It is the only part of the skill that is indexed by the agent’s high-level router. When a user sends a prompt, the agent semantic-matches the prompt against the description fields of all available skills.

---
name: database-inspector
description: Use this skill when the user asks to query the database, check table schemas, or inspect user data in the local PostgreSQL instance.
---
Key Fields:

name: This is not mandatory. Must be unique within the scope. Lowercase, hyphens allowed (e.g., postgres-query, pr-reviewer). If its not provided, it will default to the directory name.
description: This is mandatory and the most important field. It functions as the "trigger phrase." It must be descriptive enough for the LLM to recognize semantic relevance. A vague description like "Database tools" is insufficient. A precise description like "Executes read-only SQL queries against the local PostgreSQL database to retrieve user or transaction data. Use this for debugging data states" ensures the skill is picked up correctly.
The Markdown Body

The body contains the instructions. This is “prompt engineering” persisted to a file. When the skill is activated, this content is injected into the agent’s context window.

The body should include:

Goal: A clear statement of what the skill achieves.
Instructions: Step-by-step logic.
Examples: Few-shot examples of inputs and outputs to guide the model’s performance.
Constraints: “Do not” rules (e.g., “Do not run DELETE queries”).
Example SKILL.md Body:

Database Inspector

Goal
To safely query the local database and provide insights on the current data state.

Instructions
- Analyze the user's natural language request to understand the data need.
- Formulate a valid SQL query.
  - CRITICAL: Only SELECT statements are allowed.
- Use the script scripts/query_runner.py to execute the SQL.
  - Command: python scripts/query_runner.py "SELECT * FROM..."
- Present the results in a Markdown table.

Constraints
- Never output raw user passwords or API keys.
- If the query returns > 50 rows, summarize the data instead of listing it all.

Script Integration
One of the most powerful features of Skills is the ability to delegate execution to scripts. This allows the agent to perform actions that are difficult or impossible for an LLM to do directly (like binary execution, complex mathematical calculation, or interacting with legacy systems).

Get Romin Irani’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe
Scripts are placed in the scripts/ subdirectory. The SKILL.md references them by relative path.

Best Practice: Keep scripts atomic. A script should do one thing well (e.g., “run a query,” “deploy to staging”).
Language Agnosticism: Antigravity can execute any script available in the host environment’s path (Python, Node, Bash, Go). However, Python is the most common choice due to its readability and rich library ecosystem.
Arguments and Flags: The instruction body in SKILL.md must clearly specify how to pass arguments to the script. The agent will then generate the correct CLI invocation based on the user's request. For example, if the script takes a --env flag, the SKILL.md should instruct the agent to extract the environment (dev, stage, prod) from the user's prompt and map it to that flag.
Let’s build out some Skills
The goal of this section is to build out Skills that integrate into Antigravity and progressively show various features like resources / scripts / etc.

You can download the Skills from the Github repo here:

GitHub - rominirani/antigravity-skills: Sample Google Antigravity Skills
Sample Google Antigravity Skills. Contribute to rominirani/antigravity-skills development by creating an account on…
github.com

We can look to placing each of these skills inside of either ~/.gemini/antigravity/skills folder or <workspace-folder>/.agent/skills folder.

Level 1 : The Basic Router ( git-commit-formatter )
Let’s consider this as the “Hello World” of Skills.

Developers often write lazy commit messages e.g. “wip”, “fix bug”, “updates”. Enforcing “Conventional Commits” manually is tedious and often forgotten. Let’s implement a Skill that enforces the Conventional Commits specification. By simply instructing the agent on the rules, we allow it to act as the enforcer.

git-commit-formatter/
└── SKILL.md  (Instructions only)
The SKILL.md file is shown below:

---
name: git-commit-formatter
description: Formats git commit messages according to Conventional Commits specification. Use this when the user asks to commit changes or write a commit message.
---

# Git Commit Formatter Skill

When writing a git commit message, you MUST follow the Conventional Commits specification.

## Format
`<type>[optional scope]: <description>`

## Allowed Types
- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

## Instructions
1. Analyze the changes to determine the primary `type`.
2. Identify the `scope` if applicable (e.g., specific component or file).
3. Write a concise `description` in imperative mood (e.g., "add feature" not "added feature").
4. If there are breaking changes, add a footer starting with `BREAKING CHANGE:`.

## Example
`feat(auth): implement login with google`
How to Run This Example:

Make a small change to any file in your workspace.
Open the chat and type: Commit these changes.
The Agent will not just run git commit. It will first activate the git-commit-formatter skill.
Result: A conventional Git commit message will be proposed.
For e.g. I made Antigravity add some comments to a sample Python file and it ended up with a Git commit message like docs: add detailed comments to demo_primes.py.

Level 2 : Asset Utilization (`license-header-adder`)
This is the “Reference” pattern.

Every source file in a corporate project might need a specific 20-line Apache 2.0 license header. Putting this static text directly into the prompt (or SKILL.md) is wasteful. It consumes tokens every time the skill is indexed, and the model might “hallucinate” typos in legal text.

Offloading the static text to a plain text file in a `resources/` folder. The skill instructs the agent to read this file only when needed.

license-header-adder/
├── SKILL.md
└── resources/
    └── HEADER_TEMPLATE.txt  (The heavy text)
The SKILL.md file is shown below:

---
name: license-header-adder
description: Adds the standard open-source license header to new source files. Use involves creating new code files that require copyright attribution.
---

# License Header Adder Skill

This skill ensures that all new source files have the correct copyright header.

## Instructions

1. **Read the Template**:
   First, read the content of the header template file located at `resources/HEADER_TEMPLATE.txt`.
   
   ```python
   # Pseudocode for agent understanding
   template_content = view_file("resources/HEADER_TEMPLATE.txt")
   ```

2. **Prepend to File**:
   When creating a new file (e.g., `.py`, `.java`, `.js`, `.ts`, `.go`), prepend the `target_file` content with the template content.

3. **Modify Comment Syntax**:
   - For C-style languages (Java, JS, TS, C++), keep the `/* ... */` block as is.
   - For Python, Shell, or YAML, convert the block to use `#` comments.
   - For HTML/XML, use `<!-- ... -->`.

## Example Usage
If the user asks to "create a python script for hello world", you should generate:

```python
# Copyright (c) 2024 Google LLC
# ... (rest of license text) ...

def main():
    print("Hello World")
```
How to Run This Example:

Create a new dummy python file: touch my_script.py
Type: Add the license header to my_script.py.
The agent will read `license-header-adder/resources/HEADER_TEMPLATE.txt`.
It will paste the content exactly, verbatim, into your file.
Level 3: Learning by Example (`json-to-pydantic`)
The “Few-Shot” pattern.

Converting loose data (like a JSON API response) to strict code (like Pydantic models) involves dozens of decisions. How should we name the classes? Should we use `Optional`? `snake_case` or `camelCase`? Writing out these 50 rules in English is tedious and error-prone.

LLMs are pattern-matching engines. Showing them a golden example (Input -> Output) is often more effective than verbose instructions.

json-to-pydantic/
├── SKILL.md
└── examples/
    ├── input_data.json   (The Before State)
    └── output_model.py   (The After State)
The SKILL.md file is shown below:

---
name: json-to-pydantic
description: Converts JSON data snippets into Python Pydantic data models.
---

# JSON to Pydantic Skill

This skill helps convert raw JSON data or API responses into structured, strongly-typed Python classes using Pydantic.

## Instructions

1. **Analyze the Input**: Look at the JSON object provided by the user.
2. **Infer Types**:
   - `string` -> `str`
   - `number` -> `int` or `float`
   - `boolean` -> `bool`
   - `array` -> `List[Type]`
   - `null` -> `Optional[Type]`
   - Nested Objects -> Create a separate sub-class.
   
3. **Follow the Example**:
   Review `examples/` to see how to structure the output code. notice how nested dictionaries like `preferences` are extracted into their own class.
   
   - Input: `examples/input_data.json`
   - Output: `examples/output_model.py`

## Style Guidelines
- Use `PascalCase` for class names.
- Use type hints (`List`, `Optional`) from `typing` module.
- If a field can be missing or null, default it to `None`.
In the /examples folder , there is the JSON file and the output file i.e. Python file. Both of them are shown below:

input_data.json

{
    "user_id": 12345,
    "username": "jdoe_88",
    "is_active": true,
    "preferences": {
        "theme": "dark",
        "notifications": [
            "email",
            "push"
        ]
    },
    "last_login": "2024-03-15T10:30:00Z",
    "meta_tags": null
}
output_model.py

from pydantic import BaseModel, Field
from typing import List, Optional

class Preferences(BaseModel):
    theme: str
    notifications: List[str]

class User(BaseModel):
    user_id: int
    username: str
    is_active: bool
    preferences: Preferences
    last_login: Optional[str] = None
    meta_tags: Optional[List[str]] = None
How to Run This Example:

Provide the agent with a snippet of JSON (paste it in chat or point to a file).
{ "product": "Widget", "cost": 10.99, "stock": null }
2. Type: Convert this JSON to a Pydantic model.

3. The agent looks at the example pair in the skill folder.

4. It generates a Python class that perfectly mimics the coding style, imports, and structure of output_model.py, including handling the null stock as Optional.

I got the following output file (product_model.py) generated:

from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    product: str
    cost: float
    stock: Optional[int] = None
Level 4: Procedural Logic (`database-schema-validator`)
This is the “Tool Use” Pattern.

If you ask an LLM “Is this schema safe?”, it might say all is well, even if a critical primary key is missing, simply because the SQL looks correct.

Let’s delegate this check to a deterministic Script. We use the Skill to route the agent to run a Python script that we wrote. The script provides binary (True/False) truth.

database-schema-validator/
├── SKILL.md
└── scripts/
    └── validate_schema.py  (The Validator)
The SKILL.md file is shown below:

---
name: database-schema-validator
description: Validates SQL schema files for compliance with internal safety and naming policies.
---

# Database Schema Validator Skill

This skill ensures that all SQL files provided by the user comply with our strict database standards.

## Policies Enforced
1. **Safety**: No `DROP TABLE` statements.
2. **Naming**: All tables must use `snake_case`.
3. **Structure**: Every table must have an `id` column as PRIMARY KEY.

## Instructions

1. **Do not read the file manually** to check for errors. The rules are complex and easily missed by eye.
2. **Run the Validation Script**:
   Use the `run_command` tool to execute the python script provided in the `scripts/` folder against the user's file.
   
   ```bash
   python scripts/validate_schema.py <path_to_user_file>
   ```

3. **Interpret Output**:
   - If the script returns **exit code 0**: Tell the user the schema looks good.
   - If the script returns **exit code 1**: Report the specific error messages printed by the script to the user and suggest fixes.
The validate_schema.py file is shown below:

import sys
import re

def validate_schema(filename):
    """
    Validates a SQL schema file against internal policy:
    1. Table names must be snake_case.
    2. Every table must have a primary key named 'id'.
    3. No 'DROP TABLE' statements allowed (safety).
    """
    try:
        with open(filename, 'r') as f:
            content = f.read()
            
        lines = content.split('\n')
        errors = []
        
        # Check 1: No DROP TABLE
        if re.search(r'DROP TABLE', content, re.IGNORECASE):
            errors.append("ERROR: 'DROP TABLE' statements are forbidden.")
            
        # Check 2 & 3: CREATE TABLE checks
        table_defs = re.finditer(r'CREATE TABLE\s+(?P<name>\w+)\s*\((?P<body>.*?)\);', content, re.DOTALL | re.IGNORECASE)
        
        for match in table_defs:
            table_name = match.group('name')
            body = match.group('body')
            
            # Snake case check
            if not re.match(r'^[a-z][a-z0-9_]*$', table_name):
                errors.append(f"ERROR: Table '{table_name}' must be snake_case.")
                
            # Primary key check
            if not re.search(r'\bid\b.*PRIMARY KEY', body, re.IGNORECASE):
                errors.append(f"ERROR: Table '{table_name}' is missing a primary key named 'id'.")

        if errors:
            for err in errors:
                print(err)
            sys.exit(1)
        else:
            print("Schema validation passed.")
            sys.exit(0)
            
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python validate_schema.py <schema_file>")
        sys.exit(1)
        
    validate_schema(sys.argv[1])
How to Run This Example:

Create a bad SQL file bad_schema.sql:
CREATE TABLE users (name TEXT);
2. Type: Validate bad_schema.sql.

3. The agent does not guess. It will invoke the script, which fails (Exit Code 1) and it will report to us that “The validation failed because the table ‘users’ is missing a primary key.”

Level 5: The Architect (`adk-tool-scaffold`)
This pattern covers most of the features available in Skills.

Complex tasks often require a sequence of operations that combine everything we’ve seen: creating files, following templates, and writing logic. Creating a new Tool for the ADK (Agent Development Kit) requires all of this. We combine:

Script (to handle the file creation/scaffolding)
Template (to handle boilerplate in resources)
An Example (to guide the logic generation).
adk-tool-scaffold/
├── SKILL.md
├── resources/
│   └── ToolTemplate.py.hbs (Jinja2 Template)
├── scripts/
│   └── scaffold_tool.py    (Generator Script)
└── examples/
    └── WeatherTool.py      (Reference Implementation)
The SKILL.md file is shown below:

---
name: adk-tool-scaffold
description: Scaffolds a new custom Tool class for the Agent Development Kit (ADK).
---

# ADK Tool Scaffold Skill

This skill automates the creation of standard `BaseTool` implementations for the Agent Development Kit.

## Instructions

1. **Identify the Tool Name**:
   Extract the name of the tool the user wants to build (e.g., "StockPrice", "EmailSender").
   
2. **Review the Example**:
   Check `examples/WeatherTool.py` to understand the expected structure of an ADK tool (imports, inheritance, schema).

3. **Run the Scaffolder**:
   Execute the python script to generate the initial file.
   
   ```bash
   python scripts/scaffold_tool.py <ToolName>
   ```

4. **Refine**:
   After generation, you must edit the file to:
   - Update the `execute` method with real logic.
   - Define the JSON schema in `get_schema`.
   
## Example Usage
User: "Create a tool to search Wikipedia."
Agent: 
1. Runs `python scripts/scaffold_tool.py WikipediaSearch`
2. Editing `WikipediaSearchTool.py` to add the `requests` logic and `query` argument schema.
You can refer to the repository of skills to check the files in the scripts, resources and examples folder. For this specific skills, go to the adk-tool-scaffold skill.

How to Run this Example:

1. Type: Create a new ADK tool called StockPrice to fetch data from an API.

2. Step 1 (Scaffolding): The agent runs the python script. This instantly creates StockPriceTool.py with the correct class structure, imports, and class name StockPriceTool.

3. Step 2 (Implementation): The agent “reads” the file it just made. It sees
# TODO: Implement logic.

4. Step 3 (Guidance): It’s not sure how to define the JSON schema for the tool arguments. It checks examples/WeatherTool.py.

5. Completion: It edits the file to add requests.get(…) and defines the ticker argument in the schema, exactly matching the ADK style.

In Conclusion
Agent Skills are definitely a great way to bring Antigravity to write code in your way, follow rules, and use your tools.

Explore the specification, check out various repositories on the web for Skills and let me know in the feedback, about interesting ways in which you have made Skills, Rules and Workflows work within Antigravity. Have fun exploring.
