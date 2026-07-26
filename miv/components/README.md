# Components

This folder contains shared React components for the `miv` frontend.

## Folder Structure

- `ui/`: reusable low-level UI primitives such as buttons, cards, inputs, dialogs, tables, and tabs. This is the shadcn-style component library configured by `components.json`.
- `dashboard/`: composite widgets used by `app/dashboard`, such as analytics, advanced tables, filters, notifications, and workflow panels.
- `user-dashboard/`: composite widgets used by `app/user-dashboard`.
- root-level files: shared app components used across multiple areas, such as navigation, layout helpers, providers, search, and feature-level forms.

## Cleanup Rule

Keep components here only when they are imported by active app code or are shared UI primitives under `ui/`. Feature-specific components should live in the smallest clear domain folder rather than being mixed into the root.
