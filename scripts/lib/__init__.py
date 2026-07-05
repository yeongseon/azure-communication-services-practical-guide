"""ACS validator support library.

Ported from azure-container-apps-practical-guide during P3-ACS Wave 0.
This package captures policy that MUST stay in sync between:

- ``scripts/lib/content_scope.py`` (source of truth for factual-claim scope)
- Any future ACS validators that adopt the ``content_validation`` frontmatter policy.

See also: ``AGENTS.md`` §Content Validation and the P3-ACS decomposition plan at
https://github.com/yeongseon/azure-architecture-practical-guide/blob/main/.sisyphus/plans/p3-acs-frontmatter-decomposition.md
"""
