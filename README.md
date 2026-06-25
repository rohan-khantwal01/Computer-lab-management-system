# IMS Computer Lab Management System

This is a working front-end prototype for a computer lab management project.

## Features

- Student login with ID
- Teacher login dashboard
- 30-computer lab summary
- Student table with photo-style avatar, name, batch, computer, and active/offline status
- Student detail page with login time, logout time, and app usage timeline
- Student desktop screen with Chrome, File Explorer, CMD, Notepad, Excel, Word, Paint, and Settings icons
- App clicks from student desktop are saved and shown in the teacher dashboard

## Demo Login

Teacher:

- ID: `SIR001`
- Password: any value

Students:

- `IMS101`
- `IMS102`
- `IMS103`
- up to `IMS110`

## How To Run

Open `index.html` in a browser.

The demo stores data in browser `localStorage`, so it works without a server.

## Real Lab Version

For a real 30-computer lab, this prototype should be extended with:

- A central backend server and database
- A Windows student-agent app installed on every lab computer
- Teacher authentication
- Student authentication
- Live heartbeat from each computer
- Process/app tracking from Windows
- Secure logs for login, logout, attendance, and app usage

The browser-only prototype cannot read real Windows apps like Chrome, CMD, or Notepad automatically. That part needs a local Windows agent running on each student computer.
