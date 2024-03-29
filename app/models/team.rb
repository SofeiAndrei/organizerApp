class Team < ApplicationRecord
  belongs_to :owner, class_name: 'User', foreign_key: :owner_id
  has_many :team_memberships, class_name: 'TeamMembership',
                              foreign_key: 'team_id',
                              dependent: :destroy
  has_many :members, through: :team_memberships, source: :member
  has_many :team_invitations, class_name: 'TeamInvitation',
                              foreign_key: 'team_id',
                              dependent: :destroy
  has_many :invited_users, through: :team_invitations, source: :invited
  has_many :team_projects, dependent: :destroy
  has_many :team_project_tasks, through: :team_projects
  has_many :calendar_events, dependent: :destroy

  validates :name, presence: true,
                   length: { minimum: 5, maximum: 40 }

  def team_member?(user)
    members.include?(user)
  end

  def team_admin?(user)
    team_membership = team_memberships.find_by(member_id: user.id)
    team_membership.nil? ? false : team_membership.team_admin?
  end

  def add_member(user, is_admin)
    new_membership = TeamMembership.new(team: self, member: user, team_admin: is_admin)
    new_membership.save
  end

  def invite_user(user)
    invited_users << user
  end

  def retract_invitation(user)
    invited_users.delete(user)
  end

  def tasks
    team_project_tasks
  end
end
