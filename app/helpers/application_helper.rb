module ApplicationHelper
  # Creates the full title of a page
  def full_title(page_title = '')
    base_title = 'OrganizerApp'
    if page_title.empty?
      base_title
    else
      "#{page_title} | #{base_title}"
    end
  end

  def log_in_user
    post login_path, params: { session: { email: 'andreisofei@yahoo.com',
                                          password: 'passoflengthmin8' } }
  end
end
