import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { generateShareToken, revokeShareToken } from '../../redux/actions/boardActions';
import { XMarkIcon, LinkIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';

// Main ShareDialog component
const ShareDialog = ({ open, onClose, boardId, existingShareToken, isSlideshow = false }) => {
  const [shareToken, setShareToken] = useState(existingShareToken || '');
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();

  // Update shareToken when existingShareToken changes
  useEffect(() => {
    setShareToken(existingShareToken || '');
  }, [existingShareToken]);

  // Handle generating a new share token
  const handleGenerateToken = async () => {
    try {
      const token = await dispatch(generateShareToken(boardId, isSlideshow));
      setShareToken(token);
    } catch (error) {
      // Handle error
    }
  };

  // Handle revoking the current share token
  const handleRevokeToken = async () => {
    try {
      await dispatch(revokeShareToken(boardId, isSlideshow));
      setShareToken('');
    } catch (error) {
      // Handle error
    }
  };

  // Handle copying the share link to clipboard
  const handleCopyLink = () => {
    const baseUrl = window.location.origin;
    const shareUrl = isSlideshow
      ? `${baseUrl}/shared-slideshow/${shareToken}`
      : `${baseUrl}/shared/${shareToken}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: "spring", damping: 15, stiffness: 300 }}
        className={`w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl ${
          isSlideshow
            ? "bg-gradient-to-br from-gray-800 to-gray-900"
            : "bg-gradient-to-br from-gray-100 to-gray-200"
        }`}
      >
        <div className={`p-8 ${isSlideshow ? 'text-white' : 'text-gray-800'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extrabold">
              Share {isSlideshow ? "Slideshow" : "Board"}
            </h2>
            <button
              onClick={onClose}
              className={`p-2 transition-colors duration-200 rounded-full ${
                isSlideshow 
                  ? "hover:bg-white hover:bg-opacity-20" 
                  : "hover:bg-gray-300"
              }`}
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <div className={`p-6 rounded-2xl ${
            isSlideshow
              ? "bg-white bg-opacity-10 backdrop-blur-lg"
              : "bg-white shadow-md"
          }`}>
            <AnimatePresence mode="wait">
              {shareToken ? (
                <motion.div
                  key="share-link"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                >
                  <p className="mb-4 text-lg font-medium">
                    Share this link with your collaborators:
                  </p>
                  <div className={`flex items-center p-3 rounded-xl ${
                    isSlideshow
                      ? "bg-gray-700"
                      : "bg-gray-100"
                  }`}>
                    <LinkIcon className={`w-6 h-6 mr-3 ${isSlideshow ? 'text-white' : 'text-gray-600'}`} />
                    <input
                      type="text"
                      readOnly
                      value={`${window.location.origin}/${
                        isSlideshow ? "shared-slideshow" : "shared"
                      }/${shareToken}`}
                      className={`flex-grow bg-transparent focus:outline-none ${
                        isSlideshow 
                          ? "text-white placeholder-white placeholder-opacity-50" 
                          : "text-gray-800 placeholder-gray-400"
                      }`}
                    />
                    <button
                      onClick={handleCopyLink}
                      className={`p-2 ml-2 transition-colors duration-200 rounded-lg ${
                        isSlideshow
                          ? "hover:bg-gray-600"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      <DocumentDuplicateIcon className={`w-5 h-5 ${isSlideshow ? 'text-white' : 'text-gray-600'}`} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {copied && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className={`mt-4 p-3 rounded-xl ${
                          isSlideshow
                            ? "bg-gray-700"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-center">
                          Link copied to clipboard!
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="generate-prompt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                >
                  <p className="text-lg font-medium">
                    Generate a share token to create a public link for this{" "}
                    {isSlideshow ? "slideshow" : "board"}.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-8 text-center">
            <button
              onClick={shareToken ? handleRevokeToken : handleGenerateToken}
              className={`px-8 py-3 text-lg font-bold rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${
                shareToken
                  ? "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300"
                  : isSlideshow
                    ? "bg-white text-gray-800 hover:bg-gray-200 focus:ring-white"
                    : "bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-300"
              }`}
            >
              {shareToken ? "Revoke Access" : "Generate Share Link"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShareDialog;