class CalendarEventInvitationsController < ApplicationController
  def update
    calendar_event_invitation = CalendarEventInvitation.find_by(calendar_event_id: params[:calendar_event_id], user_id: params[:user_id])
    calendar_event_invitation.update(answer: params[:answer])
    puts params
  end
end
