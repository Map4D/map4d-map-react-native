require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-map4d-map"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
Map4dMap SDK for React Native
                   DESC
  s.homepage     = "https://map4d.vn"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "IOTLink" => "admin@iotlink.com.vn" }
  s.platforms    = { :ios => "9.0" }
  s.source       = { :git => "https://github.com/map4d/map4d-map-react-native", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  s.dependency "Map4dMap", "~> 2.0.0"
  # ...
  # s.dependency "..."
end

