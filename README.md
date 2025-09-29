# Movie Manager

A responsive mobile-friendly web application for managing your personal movie collection. Create, update, and organize your favorite movies with ease.

## Live Demo

Access the application at: http://3.26.211.135:3000

## Features

- **User Authentication**: Secure login and registration system
- **Movie Management**: Add, edit, and delete movies in your collection
- **Movie Details**: Store movie titles, publishing years, and poster images
- **Responsive Design**: Optimized for mobile and desktop viewing
- **Image Upload**: Upload custom poster images for your movies
- **Pagination**: Browse through your movie collection with ease

## Technologies Used

### Frontend

- Next.js 15.5.4
- React 19.1.0
- TypeScript
- Redux Toolkit for state management
- Material UI components
- Formik & Yup for form validation
- CSS for styling

### Backend

- RESTful API integration
- JWT authentication
- File upload handling

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/Priyank-a-a/movie-manager-front-end.git
   cd movie-manager
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Deployment

The application is currently deployed on AWS EC2 free tier instance and can be accessed at: http://3.26.211.135:3000

## Project Structure

- `/src/app`: Next.js app directory containing page components
- `/src/components`: Reusable React components
- `/src/services`: API service integration
- `/src/features`: Redux slices and state management
- `/src/styles`: Global CSS styles
- `/public`: Static assets

## Testing

Run tests using Jest:

```bash
npm test
# or
yarn test
```

## License

MIT
