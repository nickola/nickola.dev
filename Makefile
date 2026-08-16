# Settings
MANAGE = ./manage.py

# Not to print any recipes before executing them
.SILENT:

# Targets are not files / directories ("all" - default target, invoked by simply executing "make")
.PHONY: all $(MAKECMDGOALS)

# Using "serve" as default target
all: serve

# Ruby (Jekul)
ruby-install:
	bundle install --path .bundle/data

serve:
	bundle exec jekyll serve

serve-public:
	bundle exec jekyll serve --host 0.0.0.0

# Webpack
webpack:
	npm run start

webpack-build:
	npm run build
