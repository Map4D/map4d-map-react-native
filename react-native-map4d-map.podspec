require "json"

fabric_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-map4d-map"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "13.0" }
  s.source       = { :git => "https://github.com/map4d/map4d-map-react-native.git", :tag => "#{s.version}" }

  s.source_files  = "ios/**/*.{h,m,mm}"
  s.exclude_files = "ios/Fabric"

  s.dependency "React-Core"
  s.dependency "Map4dMapDTQG", "~> 0.1"

  if fabric_enabled
    install_modules_dependencies(s)

    s.subspec "fabric" do |ss|
      ss.source_files = "ios/Fabric/**/*.{h,m,mm}"
    end
  end
end
