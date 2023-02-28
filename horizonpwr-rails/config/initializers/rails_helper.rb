# NOTE: This is necessary in order to avoid the following error when running tests:
# Errno::EMFILE: Failed to open TCP connection to 127.0.0.1:9515 (Too many open files - socket(2) for "127.0.0.1" port 9515)
# See https://stackoverflow.com/a/65946077
#
# These work locally, but cause the build to fail when deploying:
# NameError: uninitialized constant webmock
# require 'webmock'
# NameError: uninitialized constant WebMock
# include WebMock::API

# WebMock.allow_net_connect!(net_http_connect_on_start: true)
