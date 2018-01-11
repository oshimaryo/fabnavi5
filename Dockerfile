FROM ruby:2.4.2
RUN apt-get update -qq && apt-get install -y build-essential \
  libmysqlclient-dev \
  imagemagick \
  nodejs

RUN mkdir /app
WORKDIR /app
ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock
RUN bundle install --jobs=2
COPY . /app
