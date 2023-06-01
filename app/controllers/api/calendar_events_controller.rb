class Api::CalendarEventsController < ApplicationController
  before_action :logged_in_user
  before_action :load_calendar_event, only: %i[update destroy]
  before_action :correct_user, only: %i[update destroy]
  # before_action :team_member_for_team_events

  def create
    puts calendar_event_params
    @calendar_event = CalendarEvent.new(calendar_event_params)
    if @calendar_event.save
      flash[:success] = 'Event created successfully!'
    end
  end

  def update
    puts calendar_event_params
    if @calendar_event.update(calendar_event_params)
      flash[:success] = 'Changes saved successfully!'
    end
  end

  def destroy
    @calendar_event.destroy
    flash[:success] = 'Event deleted successfully!'
  end

  private

  def calendar_event_params
    params.require(:calendar_event).permit(:name, :description, :all_day_event, :event_start, :event_end, :team_id, :organizer_id)
  end

  def load_calendar_event
    @calendar_event = CalendarEvent.includes(:organizer).find(params[:id])
  end

  def correct_user
    redirect_to root_url unless current_user?(@calendar_event.organizer)
  end
end