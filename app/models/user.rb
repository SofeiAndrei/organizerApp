class User < ApplicationRecord
  has_many :user_todo_lists, dependent: :destroy
  has_many :individual_tasks, through: :user_todo_lists
  has_many :created_teams, class_name: 'Team', foreign_key: 'owner_id', dependent: :destroy
  has_many :team_memberships, class_name: 'TeamMembership',
                              foreign_key: 'member_id',
                              dependent: :destroy
  has_many :teams, through: :team_memberships, source: :team
  has_many :team_invitations, class_name: 'TeamInvitation',
                              foreign_key: 'invited_id',
                              dependent: :destroy
  has_many :invited_by_teams, through: :team_invitations, source: :team
  has_many :assigned_tasks, class_name: 'TeamProjectTask',
                            foreign_key: 'assignee_id',
                            dependent: :nullify
  has_many :calendar_events, class_name: 'CalendarEvent',
                             foreign_key: 'organizer_id',
                             dependent: :destroy
  has_many :calendar_event_invitations, dependent: :destroy
  has_many :events_invited_to, through: :calendar_event_invitations, source: :calendar_event
  has_many :sent_friendship_requests, class_name: 'FriendshipRequest',
                                      foreign_key: 'sender_id',
                                      dependent: :destroy
  has_many :users_sent_friendship_requests_to, through: :sent_friendship_requests, source: :receiver, class_name: 'User'
  has_many :received_friendship_requests, class_name: 'FriendshipRequest',
                                          foreign_key: 'receiver_id',
                                          dependent: :destroy
  has_many :users_received_friendship_requests_from, through: :received_friendship_requests, source: :sender, class_name: 'User'
  has_many :active_friendships, class_name: 'Friendship',
                                foreign_key: 'sender_id',
                                dependent: :destroy
  has_many :active_friends, through: :active_friendships, source: :receiver, class_name: 'User'
  has_many :passive_friendships, class_name: 'Friendship',
                                 foreign_key: 'receiver_id',
                                 dependent: :destroy
  has_many :passive_friends, through: :passive_friendships, source: :sender, class_name: 'User'

  attr_accessor :remember_token, :activation_token, :reset_token

  before_save { self.email = email.downcase }
  before_create :create_activation_digest

  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]\d]+)*\.[a-z]+\z/i
  validates :name, presence: true,
                   length: { minimum: 5, maximum: 50 }
  validates :email, presence: true,
                    uniqueness: true,
                    length: { minimum: 10, maximum: 100 },
                    format: { with: VALID_EMAIL_REGEX }

  has_secure_password
  validates :password, presence: true,
                       length: { minimum: 8 }

  def self.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  def self.new_token
    SecureRandom.urlsafe_base64 # string de 22 de caractere cu a-z, A-z, 0-9, - si _
  end

  def remember
    self.remember_token = User.new_token
    update_attribute(:remember_digest, User.digest(remember_token))
  end

  def forget
    update_attribute(:remember_digest, nil)
  end

  # Returns true if the given token when passed to the hash function returns the digest
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?

    BCrypt::Password.new(digest).is_password?(token)
  end

  def activate
    update_columns(activated: true, activated_at: Time.zone.now)
  end

  def send_activation_email
    UserMailer.account_activation(self).deliver_now
  end

  def create_reset_digest
    self.reset_token = User.new_token
    update_columns(reset_digest: User.digest(reset_token), reset_sent_at: Time.zone.now)
  end

  def send_password_reset_email
    UserMailer.password_reset(self).deliver_now
  end

  def password_reset_expired?
    reset_sent_at < 2.hours.ago
  end

  def tasks
    {
      individual_tasks: individual_tasks,
      assigned_tasks: assigned_tasks
    }
  end

  def send_friend_request(another_user)
    users_sent_friendship_requests_to << another_user
  end

  def retract_friend_request(another_user)
    users_sent_friendship_requests_to.delete(another_user)
  end

  def sent_friend_request?(another_user)
    users_sent_friendship_requests_to.include?(another_user)
  end

  def received_friend_request?(another_user)
    users_received_friendship_requests_from.include?(another_user)
  end

  def befriend(another_user)
    passive_friends << another_user
  end

  def unfriend(another_user)
    if active_friends.include?(another_user)
      active_friends.delete(another_user)
    elsif passive_friends.include?(another_user)
      passive_friends.delete(another_user)
    end
  end

  def friend?(another_user)
    active_friends.include?(another_user) || passive_friends.include?(another_user)
  end

  def friendships
    active_friendships.or(passive_friendships)
  end

  def friends
    Friendship.includes(:receiver, :sender).where('friendships.receiver_id = ? or friendships.sender_id = ?', id, id).map do |friendship|
      if friendship.receiver == self
        friendship.sender
      else
        friendship.receiver
      end
    end
  end

  def common_friends(another_user)
    friends&.select { |friend| another_user.friend?(friend) && friend != self }
  end

  private

  def create_activation_digest
    self.activation_token = User.new_token
    self.activation_digest = User.digest(activation_token)
  end
end
