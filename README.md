# Notification System Design

## What It Does
A simple app that shows notifications with filtering and pagination.

---

## Frontend (React + Vite)
Located in `notification-app-fe/`

---

## Components

### `NotificationsPage.jsx`
The main page. Shows all notifications, handles filtering and pagination.

### `NotificationCard.jsx`
Displays a single notification (title, message, type, time).

### `NotificationFilter.jsx`
Buttons to filter notifications by type:
- **All** – every notification
- **Placement** – placement updates
- **Result** – result announcements
- **Event** – event reminders

---

## How They Connect

```
NotificationsPage
  ├── NotificationFilter  (user picks a type)
  └── NotificationCard[]  (list of notifications)
```


---------------------------------------------------------

![Placement](image-1.png)


----------------------------------------------------------

![Result](image-2.png)

----------------------------------------------------------

![Event](image-3.png)

----------------------------------------------------------
