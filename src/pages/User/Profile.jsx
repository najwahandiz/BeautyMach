/**
 * Profile.jsx
 * 
 * User profile page - displays and manages user information.
 * Shows: profile info, quiz results, and AI recommendations.
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Sparkles, 
  Droplets, 
  Heart, 
  LogOut, 
  Edit3, 
  Save, 
  X,
  ChevronRight,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  selectIsLoggedIn, 
  selectUserProfile, 
  selectQuizResult, 
  selectRecommendations 
} from '../../features/user/userSlice';
import { logoutUser, updateUserProfileThunk, loginUser } from '../../features/user/userThunks';

/* ============ Reusable Components ============ */

// Section card wrapper
function SectionCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-sm border border-[#f5e6e0] p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Section header
function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 rounded-xl">
        <Icon className="w-5 h-5 text-[#9E3B3B]" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );
}

// Info badge
function InfoBadge({ label, value, color = 'default' }) {
  const colors = {
    default: 'bg-gray-50 text-gray-700 border-gray-200',
    primary: 'bg-[#9E3B3B]/5 text-[#9E3B3B] border-[#9E3B3B]/20',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200'
  };

  return (
    <div className={`px-4 py-2 rounded-xl border ${colors[color]}`}>
      <p className="text-xs text-gray-500 mb-0.5">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

// Concern tag
function ConcernTag({ concern }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fff5ee] text-[#9E3B3B] rounded-full text-sm font-medium border border-[#f5e6e0]">
      <AlertCircle className="w-3.5 h-3.5" />
      {concern}
    </span>
  );
}

// Product recommendation card
function ProductCard({ product, reason }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="p-4 bg-gradient-to-br from-[#fffaf5] to-white rounded-xl border border-[#f5e6e0] hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover border border-[#f5e6e0]"
          />
        ) : (
          <div className="w-16 h-16 bg-[#9E3B3B]/10 rounded-lg flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-[#9E3B3B]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[#9E3B3B] font-medium uppercase tracking-wide mb-0.5">
            {product.category}
          </p>
          <h4 className="font-semibold text-gray-800 truncate">{product.name}</h4>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{reason}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ============ Login Form Component ============ */
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onLogin(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-[#fff5ee] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-[#f5e6e0] p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-[#9E3B3B]" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome to BeautyMatch
            </h1>
            <p className="text-gray-500">Create your beauty profile</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email (optional)
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9E3B3B]/25 transition-all duration-300"
            >
              Create Profile
            </button>
          </form>

          {/* Info */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Your data is stored locally on your device
          </p>
        </div>
      </motion.div>
    </div>
  );
}

/* ============ Main Profile Component ============ */
export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get user data from Redux store
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const profile = useSelector(selectUserProfile);
  const quizResult = useSelector(selectQuizResult);
  const recommendations = useSelector(selectRecommendations);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  // Initialize edit form when profile changes
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  // Handle login
  const handleLogin = (formData) => {
    dispatch(loginUser(formData));
  };

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Handle save profile
  const handleSaveProfile = () => {
    dispatch(updateUserProfileThunk(editedProfile));
    setIsEditing(false);
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] to-[#fff5ee]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Playfair Display, serif' }}>
              My Profile
            </h1>
            <p className="text-gray-500 mt-1">Manage your beauty preferences</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-[#9E3B3B] hover:bg-[#9E3B3B]/5 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </motion.div>

        <div className="grid gap-6">
          
          {/* Profile Info Section */}
          <SectionCard>
            <div className="flex items-start justify-between mb-4">
              <SectionHeader 
                icon={User} 
                title="Personal Information" 
                subtitle="Your basic profile details"
              />
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-400 hover:text-[#9E3B3B] hover:bg-[#9E3B3B]/5 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid sm:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={editedProfile.name || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email || ''}
                      onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-wrap gap-3"
                >
                  <InfoBadge label="Name" value={profile?.name || 'Not set'} color="primary" />
                  <InfoBadge label="Email" value={profile?.email || 'Not provided'} />
                  {profile?.createdAt && (
                    <InfoBadge 
                      label="Member since" 
                      value={new Date(profile.createdAt).toLocaleDateString()} 
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>

          {/* Quiz Results Section */}
          <SectionCard>
            <SectionHeader 
              icon={Droplets} 
              title="Skin Analysis" 
              subtitle={quizResult ? "Your personalized skin profile" : "Complete the quiz to discover your skin type"}
            />

            {quizResult ? (
              <div className="space-y-4">
                {/* Skin Type Badge */}
                <div className="flex flex-wrap gap-3">
                  <InfoBadge 
                    label="Skin Type" 
                    value={quizResult.skinType?.charAt(0).toUpperCase() + quizResult.skinType?.slice(1)} 
                    color="primary" 
                  />
                  {quizResult.ageRange && (
                    <InfoBadge label="Age Range" value={quizResult.ageRange} />
                  )}
                </div>

                {/* Concerns */}
                {quizResult.concerns && quizResult.concerns.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Skin Concerns</p>
                    <div className="flex flex-wrap gap-2">
                      {quizResult.concerns.map((concern, index) => (
                        <ConcernTag key={index} concern={concern} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Retake Quiz Button */}
                <button
                  onClick={() => navigate('/skin-quiz')}
                  className="inline-flex items-center gap-2 text-sm text-[#9E3B3B] hover:underline mt-2"
                >
                  Retake Quiz
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex p-4 bg-[#9E3B3B]/5 rounded-2xl mb-4">
                  <Droplets className="w-8 h-8 text-[#9E3B3B]/60" />
                </div>
                <p className="text-gray-500 mb-4">Discover your skin type and get personalized recommendations</p>
                <button
                  onClick={() => navigate('/skin-quiz')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9E3B3B]/25 transition-all duration-300"
                >
                  Take Skin Quiz
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </SectionCard>

          {/* AI Recommendations Section */}
          <SectionCard>
            <SectionHeader 
              icon={Sparkles} 
              title="Your Skincare Routine" 
              subtitle={recommendations ? "AI-powered recommendations just for you" : "Get your personalized routine"}
            />

            {recommendations ? (
              <div className="space-y-4">
                {/* Summary */}
                {recommendations.summary && (
                  <div className="p-4 bg-gradient-to-r from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-xl border border-[#f5e6e0]">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#9E3B3B] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 text-sm leading-relaxed">{recommendations.summary}</p>
                    </div>
                  </div>
                )}

                {/* Routine Products */}
                {recommendations.routine && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(recommendations.routine).map(([step, data]) => (
                      <ProductCard
                        key={step}
                        product={data.product || { name: data.name, category: step }}
                        reason={data.reason || data.explanation || 'Recommended for your skin type'}
                      />
                    ))}
                  </div>
                )}

                {/* Refresh Recommendations */}
                <button
                  onClick={() => navigate('/skin-quiz')}
                  className="inline-flex items-center gap-2 text-sm text-[#9E3B3B] hover:underline mt-2"
                >
                  Get New Recommendations
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="inline-flex p-4 bg-[#9E3B3B]/5 rounded-2xl mb-4">
                  <Sparkles className="w-8 h-8 text-[#9E3B3B]/60" />
                </div>
                <p className="text-gray-500 mb-4">
                  {quizResult 
                    ? "AI recommendations will appear after completing the quiz"
                    : "Complete the skin quiz first to get personalized recommendations"
                  }
                </p>
                {!quizResult && (
                  <button
                    onClick={() => navigate('/skin-quiz')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#9E3B3B]/25 transition-all duration-300"
                  >
                    Start Quiz
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </SectionCard>

        </div>
      </div>
    </div>
  );
}
