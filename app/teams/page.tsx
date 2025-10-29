'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Users, Mail, Crown, Settings as SettingsIcon, ArrowLeft } from 'lucide-react'
import { GlassCard } from '@/components/UI/GlassCard'
import { Button } from '@/components/UI/Button'
import { Input } from '@/components/UI/Input'
import { Label } from '@/components/UI/Label'

interface Team {
  id: string
  name: string
  owner_id: string
  created_at: string
}

interface TeamMember {
  id: string
  user_id: string
  role: string
  status: string
}

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')

  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    // TODO: Fetch teams from API
    // For now, using mock data
    setTeams([])
    setMembers([])
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Send invite
    console.log('Invite:', inviteEmail, inviteRole)
    setShowInviteModal(false)
    setInviteEmail('')
  }

  const roles = ['owner', 'admin', 'director', 'writer', 'vfx', 'editor', 'viewer']

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-white">Teams</h1>
          </div>
          <Button
            variant="accent"
            onClick={() => setShowInviteModal(true)}
          >
            <Users className="w-4 h-4 mr-2" />
            Invite Teammate
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard borderHue="orange">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Total Teams</p>
                  <p className="text-3xl font-bold">{teams.length}</p>
                </div>
                <Users className="w-12 h-12 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard borderHue="orange">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Active Members</p>
                  <p className="text-3xl font-bold">{members.filter(m => m.status === 'active').length}</p>
                </div>
                <SettingsIcon className="w-12 h-12 text-accent" />
              </div>
            </div>
          </GlassCard>

          <GlassCard borderHue="orange">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm mb-1">Pending Invites</p>
                  <p className="text-3xl font-bold">{members.filter(m => m.status === 'pending').length}</p>
                </div>
                <Mail className="w-12 h-12 text-accent" />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Teams List */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Your Teams</h2>

          {teams.length === 0 ? (
            <GlassCard borderHue="orange" className="p-12 text-center">
              <Users className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No teams yet</h3>
              <p className="text-white/60 mb-6">
                Invite teammates to collaborate on projects
              </p>
              <Button
                variant="accent"
                onClick={() => setShowInviteModal(true)}
              >
                Invite Teammate
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {teams.map((team) => (
                <GlassCard key={team.id} borderHue="orange" className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{team.name}</h3>
                      <p className="text-sm text-white/60">
                        {members.filter(m => m.status === 'active').length} members
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <SettingsIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Invite Modal */}
        {showInviteModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md"
            >
              <GlassCard borderHue="orange" className="p-6">
                <h3 className="text-xl font-semibold mb-4">Invite Teammate</h3>
                <form onSubmit={handleInvite} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="teammate@example.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value)}
                      className="w-full px-4 py-2 bg-panel border border-white/10 rounded-lg text-white focus:outline-none focus:border-accent"
                    >
                      {roles.map(role => (
                        <option key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex-1"
                      onClick={() => setShowInviteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="accent"
                      className="flex-1"
                    >
                      Send Invite
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}

