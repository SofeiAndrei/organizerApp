class Api::CalendarEventsController < ApplicationController
  before_action :logged_in_user
  before_action :load_calendar_event, only: %i[update destroy]
  before_action :correct_user, only: %i[update destroy]
  # before_action :team_member_for_team_events

  def create
    @calendar_event = CalendarEvent.new(calendar_event_params)
    return unless @calendar_event.save

    params[:invited_users_ids].each do |user_id|
      answer = user_id == current_user.id ? 'organizer' : 'no_answer'
      CalendarEventInvitation.create({ user_id: user_id, calendar_event_id: @calendar_event.id, answer: answer })
    end
  end

  def update
    return unless @calendar_event.update(calendar_event_params)

    flash[:success] = 'Changes saved successfully!'
    # remove the users that were deleted from the invited list
    @calendar_event.invited_user_ids.each do |user_id|
      user_still_invited = params[:invited_users_ids].include?(user_id)
      CalendarEventInvitation.find_by(user_id: user_id, calendar_event_id: @calendar_event.id).destroy unless user_still_invited
    end

    # add the users that were added to the invited list
    params[:invited_users_ids].each do |user_id|
      user_already_invited = @calendar_event.invited_user_ids.include?(user_id)
      CalendarEventInvitation.create({ user_id: user_id, calendar_event_id: @calendar_event.id, answer: 'no_answer' }) unless user_already_invited
    end
  end

  def destroy
    @calendar_event.destroy
  end

  private

  def calendar_event_params
    params.require(:calendar_event).permit(:name, :description, :all_day_event, :event_start, :event_end, :team_id, :organizer_id)
  end

  def load_calendar_event
    @calendar_event = CalendarEvent.includes(:organizer, :invited_users).find(params[:id])
  end

  def correct_user
    redirect_to root_url unless current_user?(@calendar_event.organizer)
  end
end
