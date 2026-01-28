/**
 * Profile.jsx
 * 
 * User profile page - displays and manages user information.
 * Shows: profile info, quiz results, and AI recommendations.
 * 
 * KEY FEATURES:
 * - Modern, luxurious, minimal design
 * - Saved skin type, concerns, age range
 * - AI recommendations with Add to Cart
 * - Data persisted via Redux + localStorage
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Sparkles, Droplets, Heart, LogOut, Edit3, Save, X,
  ChevronRight, Calendar, Mail, AlertCircle, CheckCircle2,
  ShoppingBag, Check, Star, Crown, Gem, RotateCcw
} from 'lucide-react';
import { 
  selectIsLoggedIn, selectUserProfile, selectQuizResult, selectRecommendations 
} from '../../features/user/userSlice';
import { logoutUser, updateUserProfileThunk, loginUser, clearQuizDataThunk } from '../../features/user/userThunks';
import { addToCart, selectIsInCart } from '../../features/cart/cartSlice';
import { useToast } from '../../components/Toast';

/* ============ Skin Type Config ============ */
const skinTypeConfig = {
  dry: { emoji: "🏜️", gradient: "from-amber-500 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
  oily: { emoji: "✨", gradient: "from-emerald-500 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  combination: { emoji: "⚖️", gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-50", text: "text-blue-700" },
  sensitive: { emoji: "🌸", gradient: "from-pink-500 to-rose-500", bg: "bg-pink-50", text: "text-pink-700" },
  normal: { emoji: "🌟", gradient: "from-purple-500 to-violet-500", bg: "bg-purple-50", text: "text-purple-700" }
};

/* ============ Routine Step Config ============ */
const routineStepConfig = {
  cleanser: { label: "Cleanser", icon: "🧴", step: 1 },
  serum: { label: "Serum", icon: "💧", step: 2 },
  moisturizer: { label: "Moisturizer", icon: "🧴", step: 3 },
  sunscreen: { label: "Sunscreen", icon: "☀️", step: 4 }
};

/* ============ Product Card Component ============ */
function ProductRecommendationCard({ stepKey, data, dispatch, productsData }) {
  const { showToast } = useToast();
  
  // Find full product details
  const product = productsData?.find(p => p.id === data?.productId) || null;
  const isInCart = useSelector(state => selectIsInCart(state, product?.id));
  
  const stepInfo = routineStepConfig[stepKey] || { label: stepKey, icon: "✨", step: 0 };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.name || data.name,
        price: product.price || 0,
        imageUrl: product.imageUrl || product.image || '',
        category: stepKey
      }));
      showToast(`${product.name || data.name} added to cart!`, 'success');
    }
  };

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-[#9E3B3B]/10 transition-all duration-500"
    >
      {/* Step Badge */}
      <div className="bg-gradient-to-r from-[#9E3B3B]/5 to-[#ea7b7b]/5 px-4 py-3 border-b border-gray-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] text-white flex items-center justify-center text-sm font-bold shadow-lg">
          {stepInfo.step}
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">Step {stepInfo.step}</p>
          <p className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
            {stepInfo.icon} {stepInfo.label}
          </p>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Image */}
          {product?.imageUrl || product?.image ? (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={product.imageUrl || product.image} 
                alt={data.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-[#9E3B3B]/40" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-900 truncate group-hover:text-[#9E3B3B] transition-colors">
              {data.name || 'Unknown Product'}
            </h4>
            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
              {data.reason || data.explanation || 'Recommended for your skin type'}
            </p>
          </div>
        </div>

        {/* Price & Add to Cart */}
        {product && (
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
            <span className="text-lg font-bold text-[#9E3B3B]">
              ${product.price?.toFixed(2) || '0.00'}
            </span>
            
            <button 
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${
                isInCart 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white hover:shadow-lg hover:shadow-[#9E3B3B]/30 hover:scale-105'
              }`}
            >
              {isInCart ? <><Check size={14} /> Added</> : <><ShoppingBag size={14} /> Add</>}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ============ Login Form Component ============ */
function LoginForm({ onLogin }) {
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onLogin(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fffaf5] to-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-[#9E3B3B]/10 border border-gray-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] rounded-2xl mb-5 shadow-xl shadow-[#9E3B3B]/30 rotate-3">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome to BeautyMatch
            </h1>
            <p className="text-gray-500">Create your personalized beauty profile</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10 outline-none transition-all text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-4 focus:ring-[#9E3B3B]/10 outline-none transition-all text-gray-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-xl shadow-xl shadow-[#9E3B3B]/30 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 text-lg"
            >
              Create Profile
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            🔒 Your data is stored locally and securely on your device
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
  const { productsData } = useSelector((state) => state.products);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});

  useEffect(() => {
    if (profile) setEditedProfile(profile);
  }, [profile]);

  const handleLogin = (formData) => dispatch(loginUser(formData));
  const handleLogout = () => dispatch(logoutUser());
  const handleSaveProfile = () => {
    dispatch(updateUserProfileThunk(editedProfile));
    setIsEditing(false);
  };
  const handleClearQuiz = () => {
    dispatch(clearQuizDataThunk());
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const skinConfig = skinTypeConfig[quizResult?.skinType] || skinTypeConfig.normal;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fffaf5] to-white">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center shadow-xl shadow-[#9E3B3B]/30">
              <span className="text-2xl font-bold text-white">
                {profile?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                Hello, {profile?.name || 'Beauty Lover'}!
              </h1>
              <p className="text-gray-500">Your personalized beauty journey</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Left Column - Profile & Skin Analysis */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#9E3B3B] to-[#ea7b7b] p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Profile</h3>
                      <p className="text-white/70 text-xs">Your details</p>
                    </div>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Edit3 className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex gap-1">
                      <button onClick={() => setIsEditing(false)} className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                      <button onClick={handleSaveProfile} className="p-2 text-emerald-200 hover:text-emerald-100 hover:bg-emerald-500/20 rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Name</label>
                        <input
                          type="text"
                          value={editedProfile.name || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all text-gray-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1.5">Email</label>
                        <input
                          type="email"
                          value={editedProfile.email || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-[#9E3B3B] focus:ring-2 focus:ring-[#9E3B3B]/20 outline-none transition-all text-gray-800"
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Name</p>
                          <p className="font-medium text-gray-800">{profile?.name || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-wider">Email</p>
                          <p className="font-medium text-gray-800">{profile?.email || 'Not provided'}</p>
                        </div>
                      </div>
                      {profile?.createdAt && (
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider">Member since</p>
                            <p className="font-medium text-gray-800">{new Date(profile.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Skin Analysis Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 rounded-xl">
                    <Droplets className="w-5 h-5 text-[#9E3B3B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Skin Analysis</h3>
                    <p className="text-gray-500 text-xs">Your skin profile</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {quizResult ? (
                  <div className="space-y-4">
                    {/* Skin Type Badge */}
                    <div className={`flex items-center gap-4 p-4 ${skinConfig.bg} rounded-2xl border border-${skinConfig.text.replace('text-', '')}/20`}>
                      <span className="text-4xl">{skinConfig.emoji}</span>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Skin Type</p>
                        <p className={`font-bold text-lg ${skinConfig.text}`}>
                          {quizResult.skinType?.charAt(0).toUpperCase() + quizResult.skinType?.slice(1)}
                        </p>
                      </div>
                    </div>

                    {/* Age Range */}
                    {quizResult.ageRange && (
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Age Range</p>
                        <p className="font-semibold text-gray-800">{quizResult.ageRange}</p>
                      </div>
                    )}

                    {/* Concerns */}
                    {quizResult.concerns && quizResult.concerns.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2 font-medium">Skin Concerns</p>
                        <div className="flex flex-wrap gap-2">
                          {quizResult.concerns.map((concern, index) => (
                            <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fffaf5] text-[#9E3B3B] rounded-full text-xs font-medium border border-[#9E3B3B]/20">
                              <AlertCircle className="w-3 h-3" />
                              {concern}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => navigate('/skin-quiz')}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-medium rounded-xl text-sm hover:shadow-lg transition-all"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retake Quiz
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <div className="inline-flex p-4 bg-[#9E3B3B]/5 rounded-2xl mb-4">
                      <Droplets className="w-8 h-8 text-[#9E3B3B]/40" />
                    </div>
                    <p className="text-gray-500 mb-4 text-sm">Discover your skin type</p>
                    <button
                      onClick={() => navigate('/skin-quiz')}
                      className="w-full px-5 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg shadow-[#9E3B3B]/25 hover:shadow-xl transition-all"
                    >
                      Take Skin Quiz
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Recommendations */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl shadow-gray-100/50 border border-gray-100 overflow-hidden h-full"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#fffaf5] to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] rounded-xl shadow-lg shadow-[#9E3B3B]/30">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Your Skincare Routine
                      </h3>
                      <p className="text-gray-500 text-sm">AI-powered recommendations</p>
                    </div>
                  </div>
                  {recommendations && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      ✓ Active
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {recommendations ? (
                  <div className="space-y-6">
                    {/* AI Summary */}
                    {recommendations.summary && (
                      <div className="p-5 bg-gradient-to-r from-[#9E3B3B]/5 via-white to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-[#9E3B3B] flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm leading-relaxed">{recommendations.summary}</p>
                        </div>
                      </div>
                    )}

                    {/* Product Grid */}
                    {recommendations.routine && (
                      <div className="grid sm:grid-cols-2 gap-4">
                        {Object.entries(recommendations.routine)
                          .filter(([_, data]) => data !== null)
                          .map(([stepKey, data]) => (
                            <ProductRecommendationCard
                              key={stepKey}
                              stepKey={stepKey}
                              data={data}
                              dispatch={dispatch}
                              productsData={productsData}
                            />
                          ))}
                      </div>
                    )}

                    {/* Get New Recommendations */}
                    <div className="flex justify-center pt-4">
                      <button
                        onClick={() => navigate('/skin-quiz')}
                        className="inline-flex items-center gap-2 text-[#9E3B3B] hover:underline font-medium"
                      >
                        Get New Recommendations
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-3xl mb-6">
                      <Gem className="w-12 h-12 text-[#9E3B3B]/40" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                      {quizResult ? "Ready for Your Routine!" : "Discover Your Perfect Products"}
                    </h4>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                      {quizResult 
                        ? "Take the quiz again to get fresh AI-powered product recommendations."
                        : "Complete the skin quiz first to unlock your personalized skincare routine."
                      }
                    </p>
                    <button
                      onClick={() => navigate('/skin-quiz')}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-2xl shadow-xl shadow-[#9E3B3B]/30 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      <Sparkles className="w-5 h-5" />
                      {quizResult ? "Get Recommendations" : "Start Skin Quiz"}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
