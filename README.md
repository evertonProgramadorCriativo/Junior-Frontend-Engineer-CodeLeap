# CodeLeap CRUD Test - Frontend Application

Welcome to my submission for the CodeLeap frontend coding test!

## Everton Eduardo 


A modern social networking application built with React that allows users to create, edit, and share posts with the community.

 Features
-----------

*   **User Authentication**: Simple username-based authentication system
*   **Post Management**: Create, edit, and delete posts with rich content
*   **Image Upload**: Upload and attach images to posts using Cloudinary integration
*   **User Profiles**: Complete profile management with avatar upload
*   **Community Users**: Browse users from both registered members and external API
*   **Responsive Design**: Fully responsive interface that works on all devices
*   **Real-time Updates**: Optimistic UI updates for seamless user experience

 Prerequisites
----------------

*   Node.js (v14 or higher)
*   npm or yarn package manager
*   Cloudinary account (for image uploads)

 Installation
----------------

1.  Clone the repository:

bash

    git clone <repository-url>
    cd junior-everton

2.  Install dependencies:

bash

    npm install

3.  Configure Cloudinary:
    *   Open `src/services/cloudinaryService.js`
    *   Update `CLOUD_NAME` and `UPLOAD_PRESET` with your Cloudinary credentials
4.  Start the development server:

bash

    npm start

The application will open at `http://localhost:3000`


 Key Components
-----------------

### Authentication System

*   **SignUpModal**: Initial user registration
*   **AuthContext**: Manages authentication state globally

### Post Management

*   **CreatePostForm**: Create new posts with title, content, and optional image
*   **PostCard**: Display posts with edit/delete options for owners
*   **EditModal/DeleteModal**: Manage post modifications

### User Profiles

*   **ProfilePage**: Complete user profile with avatar, personal information
*   **UsersPage**: Browse registered users and community members
*   **AvatarUpload**: Easy-to-use avatar upload with preview

### UI Components

*   **Button**: Customizable button with variants (primary, secondary, danger, success)
*   **Input/TextArea**: Styled form inputs
*   **Modal**: Reusable modal component
*   **ImageUpload**: Image upload component with Cloudinary integration

 Available Scripts
--------------------

*   `npm start` - Run development server
*   `npm build` - Build for production
*   `npm test` - Run tests
*   `npm eject` - Eject from Create React App (irreversible)

 API Integration
------------------

The application integrates with two main APIs:

1.  **CodeLeap API** (`https://dev.codeleap.co.uk/careers/`)
    *   POST creation, editing, and deletion
    *   Handles all post-related operations
2.  **Random User API** (`https://randomuser.me/api/`)
    *   Fetches community users for the Users page

 Data Storage
---------------

*   **Posts**: Stored via external API with images managed through Cloudinary
*   **User Profiles**: Stored in-memory using JavaScript Map (persists during session)
*   **Authentication**: Session-based (username stored in React state)

 Styling
----------

*   Custom CSS with responsive design
*   Consistent color scheme with primary color `#7695EC`
*   Mobile-first approach with breakpoints at 768px, 480px, and smaller
*   Smooth animations and transitions throughout

 Image Handling
------------------

Images are uploaded to Cloudinary with the following features:

*   Maximum file size: 5MB
*   Supported formats: All image types
*   Automatic optimization and CDN delivery
*   Preview before upload
*   Easy removal option

 
Author
------------

Everton Eduardo
