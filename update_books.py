import re

with open('/Users/dangelor.palladinolckroomr/Code/etf-core/src/content/books.ts', 'r') as f:
    content = f.read()

target = """    title: 'Motion',
    subtitle: 'Take Control of Your Life After Sports — Volume 1',
    author: "D'Angelo Palladino",
    price: 9.99,
    tagline: 'A replacement operating system for the former athlete.',
    description: [
      'The last game ends, and the structure that organized your entire life disappears overnight. The alarm, the teammates, the coaches, the scoreboard — gone. What remains is you, without the context that made you make sense.',
      'Motion is not a motivational book. It is not a therapy workbook. It is not a career-transition guide. It is a replacement operating system for former athletes, built around two integrated systems: the 6 Identities inventory and the Executable Transition Framework (ETF™).',
      'The 6 Identities tells you exactly which of six types you are currently operating in, what internal engine is driving your behavior, and what formation context shaped how you arrived here. The ETF™ takes it from there — eight components that rebuild identity, relationships, community, daily structure, and execution on top of the permanent foundation your athletic career already built.',
    ],"""

replacement = """    title: 'Motion™ [VERIFY: availability date]',
    subtitle: 'Take Control of Your Life After Sports — Volume 1',
    author: "D'Angelo Palladino",
    price: 9.99,
    tagline: 'A manual for building momentum when you have no structure and no team. Stop thinking your way out of the transition. Move.',
    description: [
      'The last game ends, and the structure that organized your entire life disappears overnight. The alarm, the teammates, the coaches, the scoreboard — gone. What remains is you, without the context that made you make sense.',
      'Motion is not a motivational book. It is not a therapy workbook. It is not a career-transition guide. It is a manual for building momentum when you have no structure and no team. Stop thinking your way out of the transition. Move.',
      'The 6 Identities tells you exactly which of six types you are currently operating in, what internal engine is driving your behavior, and what formation context shaped how you arrived here. The ETF™ takes it from there — eight components that rebuild identity, relationships, community, daily structure, and execution on top of the permanent foundation your athletic career already built.',
    ],"""

content = content.replace(target, replacement)

with open('/Users/dangelor.palladinolckroomr/Code/etf-core/src/content/books.ts', 'w') as f:
    f.write(content)
