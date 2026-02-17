import { Routes, Route, Navigate } from 'react-router-dom';
import { RBLayout } from './projects/ai-resume-builder/layout/RBLayout';
import { RBStepPage } from './projects/ai-resume-builder/pages/RBStepPage';
import { RBProofPage } from './projects/ai-resume-builder/pages/RBProofPage';

function App() {
  return (
    <Routes>
      {/* ... other existing routes ... */}
      <Route path="/" element={<Navigate to="/rb" replace />} />

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