import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: true,
    language: 'en',
    theme: 'dark',
    dataRefresh: '10',
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const SettingSection = ({ emoji, title, description, children }) => (
    <div className="bg-gray-800/50 border border-emerald-500/20 rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{emoji}</div>
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-4xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">Manage application preferences and notifications</p>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SettingSection
          emoji="🔔"
          title="Notifications"
          description="Configure how you receive crime detection alerts"
        >
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  setSettings({ ...settings, notifications: e.target.checked })
                }
                className="w-4 h-4 rounded border-emerald-500"
              />
              <span className="text-gray-300">Enable real-time notifications</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, emailAlerts: e.target.checked })
                }
                className="w-4 h-4 rounded border-emerald-500"
              />
              <span className="text-gray-300">Email alerts for critical crimes</span>
            </label>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Data Refresh Interval</label>
              <select
                value={settings.dataRefresh}
                onChange={(e) =>
                  setSettings({ ...settings, dataRefresh: e.target.value })
                }
                className="w-full bg-gray-700 border border-emerald-500/30 rounded-lg px-3 py-2 text-white"
              >
                <option value="5">Every 5 seconds</option>
                <option value="10">Every 10 seconds</option>
                <option value="30">Every 30 seconds</option>
                <option value="60">Every minute</option>
              </select>
            </div>
          </div>
        </SettingSection>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SettingSection
          emoji="🌙"
          title="Appearance"
          description="Customize the look and feel of the application"
        >
          <div className="space-y-3">
            <label className="text-gray-300 text-sm block">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              {['dark', 'light'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setSettings({ ...settings, theme })}
                  className={`
                    p-3 rounded-lg border-2 transition-all capitalize
                    ${
                      settings.theme === theme
                        ? 'border-emerald-400 bg-emerald-500/20'
                        : 'border-emerald-500/30 bg-gray-700/50 hover:border-emerald-500/50'
                    }
                  `}
                >
                  {theme} Mode
                </button>
              ))}
            </div>
          </div>
        </SettingSection>
      </motion.div>

      {/* Localization Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <SettingSection
          emoji="🌍"
          title="Localization"
          description="Select your preferred language and region"
        >
          <div>
            <label className="text-gray-300 text-sm block mb-2">Language</label>
            <select
              value={settings.language}
              onChange={(e) =>
                setSettings({ ...settings, language: e.target.value })
              }
              className="w-full bg-gray-700 border border-emerald-500/30 rounded-lg px-3 py-2 text-white"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="pt">Português</option>
              <option value="zh">中文</option>
            </select>
          </div>
        </SettingSection>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <SettingSection
          emoji="🔒"
          title="Security"
          description="Manage your account security and privacy"
        >
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-colors">
              Two-Factor Authentication
            </button>
            <button className="w-full px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors">
              Logout All Sessions
            </button>
          </div>
        </SettingSection>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3"
      >
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30 rounded-lg transition-colors font-semibold"
        >
          <span>💾</span>
          Save Changes
        </button>
        <button className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-semibold">
          Reset to Defaults
        </button>
      </motion.div>

      {/* Feedback */}
      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 text-emerald-400 text-sm"
        >
          ✓ Settings saved successfully
        </motion.div>
      )}

      {/* API Status */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
        <p className="text-sm text-cyan-400">
          <strong>API Status:</strong> Connected to http://localhost:8000
        </p>
      </div>
    </div>
  );
}
