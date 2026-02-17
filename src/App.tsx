import { Routes, Route, Navigate } from 'react-router-dom';
import { RBLayout } from './projects/ai-resume-builder/layout/RBLayout';
import { RBStepPage } from './projects/ai-resume-builder/pages/RBStepPage';
import { RBProofPage } from './projects/ai-resume-builder/pages/RBProofPage';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import { Preview } from './pages/Preview';
import { Proof } from './pages/Proof';

function App() {
  return (
    <Routes>
      {/* Main Application Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/proof" element={<Proof />} />

      {/* ... other existing routes ... */}

      {/* Project 3: AI Resume Builder Routes */}
      <Route path="/rb" element={<RBLayout />}>
        <Route index element={<Navigate to="01-problem" replace />} />
        <Route path="proof" element={<RBProofPage />} />
        <Route path=":stepSlug" element={<RBStepPage />} />
      </Route>
    </Routes>
  );
}

export default App;