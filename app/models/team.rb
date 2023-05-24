class Team < ApplicationRecord
  belongs_to :owner, class_name: 'User', foreign_key: :owner_id
  has_many :team_memberships, class_name: 'TeamMembership',
                              foreign_key: 'team_id',
                              dependent: :destroy
  has_many :members, through: :team_memberships, source: :member

  validates :name, presence: true,
                   length: { minimum: 5, maximum: 30 }

  def team_member?(user)
    return self.members.include?(user)
  end

  def team_admin?(user)
    team_membership = self.team_memberships.find(member_id: user.id)
    return team_membership.team_admin?
  end

  def add_member(user, is_admin)
    new_membership = TeamMembership.new(team: self, member: user, team_admin: is_admin)
    new_membership.save
  end
end
