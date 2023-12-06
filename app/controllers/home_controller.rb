class HomeController < ApplicationController
  def index
  end

  def search
    json = JSON.parse(File.read(Rails.root.join('public', 'movies.json')))
    if params[:q].blank?
      @movies = []
    else
      @movies = json["movies"].select { |movie| movie['title'].downcase.include?(params[:q].downcase) }
    end

    # debugger

    respond_to do |format|
      format.html { render :search, layout: !request.xhr?  }
      format.json { render json: @movies.to_json }
    end
  end
end
