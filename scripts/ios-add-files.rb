# Adds the app's own Swift files and privacy manifest to the Xcode "App" target,
# so nobody has to drag them in by hand on a Mac.
require 'xcodeproj'
project_path = File.join(__dir__, '..', 'ios', 'App', 'App.xcodeproj')
project = Xcodeproj::Project.open(project_path)
target = project.targets.find { |t| t.name == 'App' } or abort('No "App" target found')
group = project.main_group.find_subpath('App', false) or abort('No "App" group found')
{
  'PrintPlugin.swift' => :source,
  'MainViewController.swift' => :source,
  'PrivacyInfo.xcprivacy' => :resource
}.each do |name, kind|
  ref = group.files.find { |f| f.path == name } || group.new_reference(name)
  if kind == :source
    target.source_build_phase.add_file_reference(ref, true)
  else
    target.resources_build_phase.add_file_reference(ref, true)
  end
end
project.save
puts 'iOS: native files added to the App target.'
