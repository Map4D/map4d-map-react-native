const defaultRoadmapStyle = {
    "web-version": "2.2.0",
    "mobile-version": "2.1.0",
    "sources": {
        "map4d": {
            "url": "map4d://tiles"
        },
        "geojson": {
            "type": "json",
            "url": ""
        }
    },
    "images": {
        "pois": {
            "type": "simple_sprite",
            "url": [
                "https://maptile.s3-sgn10.fptcloud.com/v1/AUTH_b32b6bc102c44269ab7b55e7820e7116/data/images/627cd15e9c4fa69f92878f59.png",
                "https://maptile.s3-sgn10.fptcloud.com/v1/AUTH_b32b6bc102c44269ab7b55e7820e7116/data/images/627cd15e9c4fa69f92878f5a.png",
                "https://maptile.s3-sgn10.fptcloud.com/v1/AUTH_b32b6bc102c44269ab7b55e7820e7116/data/images/627cd15e9c4fa69f92878f5b.png"
            ],
            "width": 26,
            "height": 32
        },
    },
    "patterns": {
        "dashdash": {
            "type": "dash",
            "gap": 3,
            "length": 3,
            "repeat": 2
        },
        "dotdot": {
            "type": "dot",
            "repeat": 2
        }
    },
    "layers": [
        {
            "id": "earth_earth_fill",
            "type": "background",
            "filter": null,
            "draw": {
                "color": [
                    [
                        2,
                        "#f8f9faff"
                    ]
                ]
            },
            "metadata": {
                "key": "earth",
                "name": "MÃ u ná»n/VÃ¹ng Ä‘áº¥t",
                "isDefault": true
            }
        },
        {
            "id": "water_water_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "water",
            "filter": null,
            "draw": {
                "color": "#94c0f2ff"
            },
            "metadata": {
                "name": "NÆ°á»›c",
                "key": "water",
                "isDefault": true
            }
        },
        {
            "id": "water_water_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "water",
            "filter": null,
            "draw": {
                "color": "#94c0f2ff",
                "width": [
                    [
                        12,
                        1
                    ],
                    [
                        14,
                        2
                    ]
                ]
            },
            "metadata": {
                "name": "ÄÆ°á»ng bá» biá»ƒn",
                "key": "water",
                "isDefault": true
            }
        },
        {
            "id": "roads_highway_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "highway"
                ]
            },
            "draw": {
                "width": [
                    [
                        7,
                        1
                    ],
                    [
                        10,
                        2
                    ],
                    [
                        14,
                        3
                    ],
                    [
                        15,
                        5
                    ],
                    [
                        16,
                        8
                    ],
                    [
                        17,
                        13
                    ],
                    [
                        18,
                        20
                    ],
                    [
                        19,
                        36
                    ]
                ],
                "color": "#fddc7fff",
                "outline_width": [
                    [
                        8,
                        1
                    ]
                ],
                "outline_color": "#daa130ff"
            },
            "metadata": {
                "name": "Cao tá»‘c",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_highway_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "highway"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        7,
                        12
                    ]
                ],
                "text_color": "#783b03ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "highway",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_major_road_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "major_road"
                ]
            },
            "draw": {
                "width": [
                    [
                        10,
                        1
                    ],
                    [
                        15,
                        4
                    ],
                    [
                        16,
                        8
                    ],
                    [
                        17,
                        13
                    ],
                    [
                        18,
                        20
                    ],
                    [
                        19,
                        36
                    ]
                ],
                "color": "#ffffffff",
                "outline_width": [
                    [
                        10,
                        1
                    ]
                ],
                "outline_color": "#dfe0e4ff"
            },
            "metadata": {
                "name": "ÄÆ°á»ng chÃ­nh",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_major_road_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "major_road"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        5,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "major_road",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_primary_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "major_road"
                ],
                "kind_detail": [
                    "primary",
                    "primary_link"
                ]
            },
            "draw": {
                "width": [
                    [
                        8,
                        1
                    ],
                    [
                        14,
                        3
                    ],
                    [
                        15,
                        5
                    ],
                    [
                        16,
                        8
                    ],
                    [
                        17,
                        13
                    ],
                    [
                        18,
                        20
                    ],
                    [
                        19,
                        36
                    ]
                ],
                "color": "#ffffffff",
                "outline_width": [
                    [
                        8,
                        1
                    ]
                ],
                "outline_color": "#dfe0e4ff"
            },
            "metadata": {
                "name": "ÄÆ°á»ng lá»›n",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_primary_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "major_road"
                ],
                "kind_detail": [
                    "primary",
                    "primary_link"
                ]
            },
            "draw": {
                "text_size": 12,
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "primary",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_trunk_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "major_road"
                ],
                "kind_detail": [
                    "trunk",
                    "trunk_link"
                ]
            },
            "draw": {
                "width": [
                    [
                        7,
                        1
                    ],
                    [
                        10,
                        2
                    ],
                    [
                        14,
                        3
                    ],
                    [
                        15,
                        5
                    ],
                    [
                        16,
                        8
                    ],
                    [
                        17,
                        13
                    ],
                    [
                        18,
                        20
                    ],
                    [
                        19,
                        36
                    ]
                ],
                "color": [
                    [
                        7,
                        "#fdeec1ff"
                    ],
                    [
                        13,
                        "#fde293ff"
                    ]
                ],
                "outline_width": [
                    [
                        8,
                        1
                    ]
                ],
                "outline_color": "#f8ae0aff"
            },
            "metadata": {
                "name": "Quá»‘c lá»™",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_trunk_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "major_road"
                ],
                "kind_detail": [
                    "trunk",
                    "trunk_link"
                ]
            },
            "draw": {
                "text_size": 12,
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "trunk",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_minor_road_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ]
            },
            "draw": {
                "width": [
                    [
                        16,
                        2
                    ],
                    [
                        18,
                        5
                    ],
                    [
                        19,
                        10
                    ]
                ],
                "color": "#FFF",
                "outline_width": [
                    [
                        16,
                        1
                    ]
                ],
                "outline_color": "#dfe0e4ff"
            },
            "metadata": {
                "name": "ÄÆ°á»ng phá»¥",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_minor_road_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#70757aff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "minor_road",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_unclassified_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ],
                "kind_detail": [
                    "unclassified"
                ]
            },
            "draw": {
                "width": [
                    [
                        14,
                        1
                    ],
                    [
                        15,
                        2
                    ],
                    [
                        16,
                        4
                    ],
                    [
                        17,
                        7
                    ],
                    [
                        18,
                        10
                    ],
                    [
                        19,
                        20
                    ]
                ],
                "color": [
                    [
                        14,
                        "#e8e8e8ff"
                    ],
                    [
                        15,
                        "#ffffffff"
                    ]
                ],
                "outline_width": [
                    [
                        15,
                        1
                    ]
                ],
                "outline_color": [
                    [
                        7,
                        "#dfe0e4ff"
                    ],
                    [
                        15,
                        "#dfe0e4ff"
                    ]
                ]
            },
            "metadata": {
                "name": "ÄÆ°á»ng nhá»",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_unclassified_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ],
                "kind_detail": [
                    "unclassified"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "unclassified",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_residential_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ],
                "kind_detail": [
                    "residential"
                ]
            },
            "draw": {
                "width": [
                    [
                        14,
                        1
                    ],
                    [
                        15,
                        2
                    ],
                    [
                        16,
                        4
                    ],
                    [
                        17,
                        7
                    ],
                    [
                        18,
                        10
                    ],
                    [
                        19,
                        20
                    ]
                ],
                "color": [
                    [
                        14,
                        "#e8e8e8ff"
                    ],
                    [
                        15,
                        "#ffffffff"
                    ]
                ],
                "outline_width": [
                    [
                        15,
                        1
                    ]
                ],
                "outline_color": [
                    [
                        7,
                        "#dfe0e4ff"
                    ],
                    [
                        15,
                        "#dfe0e4ff"
                    ]
                ]
            },
            "metadata": {
                "name": "ÄÆ°á»ng trong khu dÃ¢n cÆ°",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_residential_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ],
                "kind_detail": [
                    "residential"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "residential",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_footway_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ],
                "kind_detail": [
                    "footway",
                    "pedestrian"
                ]
            },
            "draw": {
                "width": [
                    [
                        16,
                        2
                    ]
                ],
                "color": "#5bb974ff",
                "outline_width": [
                    [
                        16,
                        1
                    ]
                ],
                "outline_color": "#f8f9faff"
            },
            "metadata": {
                "name": "ÄÆ°á»ng Ä‘i dáº¡o, Ä‘i bá»™",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_footway_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "minor_road",
                    "path"
                ],
                "kind_detail": [
                    "footway",
                    "pedestrian"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "footway",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_construction_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "construction"
                ]
            },
            "draw": {
                "width": [
                    [
                        14,
                        1
                    ],
                    [
                        15,
                        2
                    ]
                ],
                "color": "#DDDFE3",
                "outline_width": [
                    [
                        14,
                        1
                    ]
                ],
                "outline_color": [
                    [
                        7,
                        "#dfe0e4ff"
                    ],
                    [
                        15,
                        "#dfe0e4ff"
                    ]
                ]
            },
            "metadata": {
                "name": "ÄÆ°á»ng Ä‘ang xÃ¢y dá»±ng",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_construction_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "construction"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "construction",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_rail_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "rail"
                ]
            },
            "draw": {
                "width": [
                    [
                        10,
                        2
                    ]
                ],
                "color": [
                    [
                        10,
                        "#b9c0c5ff"
                    ]
                ],
                "outline_width": [
                    [
                        13,
                        1
                    ]
                ],
                "outline_color": "#e4a421ff",
                "pattern": "dashdash"
            },
            "metadata": {
                "name": "ÄÆ°á»ng sáº¯t",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_rail_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "rail"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "rail",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_aeroway_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "aeroway"
                ]
            },
            "draw": {
                "width": [
                    [
                        13,
                        2
                    ],
                    [
                        15,
                        6
                    ]
                ],
                "color": "#f8f9faff",
                "outline_width": [
                    [
                        10,
                        1
                    ]
                ],
                "outline_color": "#dfe0e4ff"
            },
            "metadata": {
                "name": "ÄÆ°á»ng bÄƒng",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_aeroway_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "aeroway"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "aeroway",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_ferry_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "ferry"
                ]
            },
            "draw": {
                "width": [
                    [
                        5,
                        1
                    ]
                ],
                "color": "#206cb7ff",
                "outline_width": 1,
                "outline_color": [
                    [
                        7,
                        "#dfe0e4ff"
                    ],
                    [
                        15,
                        "#dfe0e4ff"
                    ]
                ],
                "pattern": "dashdash"
            },
            "metadata": {
                "name": "ÄÆ°á»ng phÃ ",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_ferry_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "filter": {
                "kind": [
                    "ferry"
                ]
            },
            "draw": {
                "text_size": 12,
                "text_color": "#185abcff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "ferry",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_roads_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "roads",
            "draw": {
                "width": [
                    [
                        10,
                        1
                    ]
                ],
                "color": "#FFF",
                "outline_width": [
                    [
                        13,
                        1
                    ]
                ],
                "outline_color": [
                    [
                        7,
                        "#dfe0e4ff"
                    ],
                    [
                        15,
                        "#dfe0e4ff"
                    ]
                ]
            },
            "metadata": {
                "name": "ÄÆ°á»ng khÃ¡c",
                "group": "ÄÆ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "roads_roads_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "roads",
            "draw": {
                "text_size": [
                    [
                        8,
                        10
                    ],
                    [
                        17,
                        12
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "roads",
                "group": "TÃªn Ä‘Æ°á»ng giao thÃ´ng",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_boundaries_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "boundaries",
            "draw": {
                "width": [
                    [
                        2,
                        0
                    ]
                ]
            },
            "metadata": {
                "key": "boundaries",
                "group": "ÄÆ°á»ng ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_boundaries_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "boundaries",
            "draw": {
                "text_size": 10,
                "text_color": "#798083",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "boundaries",
                "group": "TÃªn ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_country_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind_detail": [
                    "2"
                ]
            },
            "draw": {
                "width": [
                    [
                        2,
                        1
                    ]
                ],
                "color": "#7f7f7ffc"
            },
            "metadata": {
                "key": "country",
                "group": "ÄÆ°á»ng ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_country_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind_detail": [
                    "2"
                ]
            },
            "draw": {
                "text_size": 10,
                "text_color": "#000000ff",
                "text_halo_color": "#ffffffff"
            },
            "metadata": {
                "key": "country",
                "group": "TÃªn ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_province_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind": [
                    "province",
                    "province_sf"
                ]
            },
            "draw": {
                "width": [
                    [
                        5,
                        1
                    ],
                    [
                        11,
                        0
                    ]
                ],
                "pattern": "dashdash",
                "color": [
                    [
                        7,
                        "#BDBDBD"
                    ],
                    [
                        8,
                        "#8a8a8aff"
                    ]
                ]
            },
            "metadata": {
                "key": "province",
                "group": "ÄÆ°á»ng ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_province_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind": [
                    "province",
                    "province_sf"
                ]
            },
            "draw": {
                "text_size": 10,
                "text_color": "#798083",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "province",
                "group": "TÃªn ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_district_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind": [
                    "district"
                ]
            },
            "draw": {
                "width": [
                    [
                        11,
                        1
                    ]
                ],
                "pattern": "dashdash",
                "color": "#8a8a8aff"
            },
            "metadata": {
                "key": "district",
                "group": "ÄÆ°á»ng ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_district_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind": [
                    "district"
                ]
            },
            "draw": {
                "text_size": 10,
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "district",
                "group": "TÃªn ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_ward_line",
            "type": "line",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind": [
                    "ward"
                ]
            },
            "draw": {
                "width": [
                    [
                        14,
                        0
                    ]
                ],
                "pattern": "dashdash",
                "color": "#8a8a8aff"
            },
            "metadata": {
                "key": "ward",
                "group": "ÄÆ°á»ng ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "boundaries_ward_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "boundaries",
            "filter": {
                "kind": [
                    "ward"
                ]
            },
            "draw": {
                "text_size": 10,
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "ward",
                "group": "TÃªn ranh giá»›i",
                "isDefault": true
            }
        },
        {
            "id": "places_places_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "draw": {
                "text_size": 0,
                "text_color": "#505050",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "places",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_country_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "country",
                    "country_sf"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        2,
                        9
                    ],
                    [
                        5,
                        12
                    ],
                    [
                        6,
                        18
                    ],
                    [
                        9,
                        0
                    ]
                ],
                "text_color": "#232323ff",
                "text_halo_color": "#ffffffff"
            },
            "metadata": {
                "key": "country",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_archipelago_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "archipelago"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        5,
                        9
                    ],
                    [
                        6,
                        12
                    ],
                    [
                        8,
                        14
                    ]
                ],
                "text_color": "#181818ff",
                "text_halo_color": "#ffffffff"
            },
            "metadata": {
                "key": "archipelago",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_sea_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "sea"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        4,
                        7
                    ],
                    [
                        5,
                        9
                    ],
                    [
                        6,
                        12
                    ],
                    [
                        7,
                        12
                    ],
                    [
                        8,
                        12
                    ],
                    [
                        10,
                        12
                    ]
                ],
                "text_color": "#232323ff",
                "text_halo_color": "#ffffffff"
            },
            "metadata": {
                "key": "sea",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_island_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "island"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        6,
                        9
                    ]
                ],
                "text_color": "#232323ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "island",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_islet_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "islet"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        12,
                        10
                    ]
                ],
                "text_color": "#121212ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "islet",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_province_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "province"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        7,
                        9
                    ],
                    [
                        8,
                        16
                    ],
                    [
                        10,
                        20
                    ],
                    [
                        14,
                        0
                    ]
                ],
                "text_color": "#565D67",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "province",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_city_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "province"
                ],
                "kind_detail": [
                    "city"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        5,
                        12
                    ],
                    [
                        8,
                        18
                    ],
                    [
                        10,
                        20
                    ],
                    [
                        14,
                        0
                    ]
                ],
                "text_color": "#1d1f20ff",
                "text_halo_color": "#ffffffff"
            },
            "metadata": {
                "key": "city",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_district_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "district"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        11,
                        12
                    ],
                    [
                        13,
                        13
                    ],
                    [
                        14,
                        0
                    ]
                ],
                "text_color": "#4e5256ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "district",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_ward_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": [
                    "ward"
                ]
            },
            "draw": {
                "text_size": [
                    [
                        14,
                        10
                    ],
                    [
                        15,
                        11
                    ],
                    [
                        17,
                        0
                    ]
                ],
                "text_color": "#414448ff",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "ward",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "places_hamlet_label",
            "type": "label",
            "source": "map4d",
            "source_layer": "places",
            "filter": {
                "kind": "hamlet"
            },
            "draw": {
                "text_size": [
                    [
                        15,
                        9
                    ]
                ],
                "text_color": "#505050",
                "text_halo_color": "#FFF"
            },
            "metadata": {
                "key": "hamlet",
                "group": "TÃªn Ä‘á»‹a giá»›i hÃ nh chÃ­nh",
                "isDefault": true
            }
        },
        {
            "id": "pois_pois_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "draw": {
                "icon_image": "pois",
                "icon_index": 1,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "pois",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_cafe_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "cafe",
                    "milk_tea",
                    "drink"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 19,
                "icon_color": "#f19800ff",
                "text_size": 12,
                "text_color": "#f19800ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "cafe",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_store_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "car_dealer",
                    "motorcycle_dealer",
                    "bicycle_store",
                    "car_rental",
                    "motorcycle_rental",
                    "cosmetic_store",
                    "mommy_store",
                    "clothing_store",
                    "glasses_store",
                    "shoe_store",
                    "electronics_store",
                    "cellphone_store",
                    "computer_store",
                    "store",
                    "fruit_shop",
                    "florist",
                    "sports_store",
                    "toy_store",
                    "furniture_store",
                    "home_goods_store",
                    "jewelry_store",
                    "book_store",
                    "pet_store",
                    "liquor_store",
                    "gift_shop",
                    "building_materials_store",
                    "musical_instrument_store",
                    "electrical_supply_store",
                    "second_hand_store",
                    "fuel_store"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 2,
                "icon_color": "#5491f5ff",
                "text_size": 12,
                "text_color": "#5491f5ff",
                "text_halo_color": "#fdfdfdff"
            },
            "metadata": {
                "key": "store",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_market_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "food_store",
                    "convenience_store",
                    "local_market",
                    "supermarket",
                    "grocery_store",
                    "shopping_mall"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 3,
                "icon_color": "#5491f5ff",
                "text_size": 12,
                "text_color": "#5491f5ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "market",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_atm_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "atm"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 4,
                "icon_color": "#7985caff",
                "text_size": 12,
                "text_color": "#7985caff",
                "text_halo_color": "#fdfdfdff"
            },
            "metadata": {
                "key": "atm",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_bank_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "bank",
                    "treasury"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 5,
                "icon_color": "#7985caff",
                "text_size": 12,
                "text_color": "#7985caff",
                "text_halo_color": "#fdfdfdff"
            },
            "metadata": {
                "key": "bank",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_pharmacy_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "pharmacy"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 6,
                "icon_color": "#ec685cff",
                "text_size": 12,
                "text_color": "#ec685cff",
                "text_halo_color": "#fdfdfdff"
            },
            "metadata": {
                "key": "pharmacy",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_hospital_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "health",
                    "hospital",
                    "doctor",
                    "physiotherapist"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 7,
                "icon_color": "#ec685cff",
                "text_size": 12,
                "text_color": "#ec685cff",
                "text_halo_color": "#fdfdfdff"
            },
            "metadata": {
                "key": "hospital",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_dentist_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "dentist"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 8,
                "icon_color": "#ec685cff",
                "text_size": 12,
                "text_color": "#ec685cff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "dentist",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_bus_station_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "bus_station",
                    "transit_station"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 10,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "bus_station",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_airport_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "airport"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 11,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "airport",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_train_station_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "train_station",
                    "subway_station"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 12,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "train_station",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_bus_stop_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "bus_stop"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 54,
                "icon_color": "#2e7dfeff",
                "text_size": 12,
                "text_color": "#2e7dfeff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "bus_stop",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_charging_station_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "charging_station"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 13,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "charging_station",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_gas_station_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "gas_station"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 14,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "gas_station",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_parking_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "parking"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 15,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "parking",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_school_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "preschool",
                    "primary_school",
                    "secondary_school",
                    "high_school",
                    "university",
                    "college",
                    "driving_school",
                    "language_center"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 16,
                "icon_color": "#78909cff",
                "text_size": 12,
                "text_color": "#78909cff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "school",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_hotel_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "lodging",
                    "hotel",
                    "apartment",
                    "guest_house"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 17,
                "icon_color": "#f06292ff",
                "text_size": 12,
                "text_color": "#f06292ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "hotel",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_pagoda_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "pagoda"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 22,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "pagoda",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_temple_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "temple",
                    "worship"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 23,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "temple",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_church_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "church"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 24,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "church",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_storage_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "storage"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 25,
                "icon_color": "#00bcfcff",
                "text_size": 12,
                "text_color": "#00bcfcff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "storage",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_industrial_zone_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "industrial_zone"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 26,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "industrial_zone",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_campground_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "campground"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 27,
                "icon_color": "#12b5cbff",
                "text_size": 12,
                "text_color": "#12b5cbff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "campground",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_museum_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "museum",
                    "art_gallery"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 28,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "museum",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_public_beach_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "public_beach"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 52,
                "icon_color": "#12b5cbff",
                "text_size": 12,
                "text_color": "#12b5cbff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "public_beach",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_gym_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "gym"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 29,
                "icon_color": "#8d70d5ff",
                "text_size": 12,
                "text_color": "#8d70d5ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "gym",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_sports_center_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "sports_center"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 30,
                "icon_color": "#8d70d5ff",
                "text_size": 12,
                "text_color": "#8d70d5ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "sports_center",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_stadium_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "stadium"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 31,
                "icon_color": "#8d70d5ff",
                "text_size": 12,
                "text_color": "#8d70d5ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "stadium",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_park_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "park",
                    "zoo"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 32,
                "icon_color": "#34a853ff",
                "text_size": 12,
                "text_color": "#34a853ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "park",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_golf_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "golf"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 33,
                "icon_color": "#8d70d5ff",
                "text_size": 12,
                "text_color": "#8d70d5ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "golf",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_amusement_park_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "amusement_park"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 34,
                "icon_color": "#12b5cbff",
                "text_size": 12,
                "text_color": "#12b5cbff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "amusement_park",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_cinema_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "cinema"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 34,
                "icon_color": "#12b5cbff",
                "text_size": 12,
                "text_color": "#12b5cbff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "cinema",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_library_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "library"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 36,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "library",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_theater_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "theater"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 37,
                "icon_color": "#12b5cbff",
                "text_size": 12,
                "text_color": "#12b5cbff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "theater",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_spa_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "spa",
                    "hair_care",
                    "beauty_salon"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 38,
                "icon_color": "#8d70d5ff",
                "text_size": 12,
                "text_color": "#8d70d5ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "spa",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_casino_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "casino"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 39,
                "icon_color": "#12b5cbff",
                "text_size": 12,
                "text_color": "#12b5cbff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "casino",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_courthouse_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "courthouse",
                    "lawyer"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 40,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "courthouse",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_police_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "police"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 41,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "police",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_committee_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "committee"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 42,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "committee",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_political_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "political"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 43,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "political",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_community_center_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "community_center"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 44,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "community_center",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_fire_station_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "fire_station"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 45,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "fire_station",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_post_office_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "post_office"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 46,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "post_office",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_veterinary_care_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "veterinary_care"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 9,
                "icon_color": "#f56357ff",
                "text_size": 12,
                "text_color": "#f56357ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "veterinary_care",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_public_restroom_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "public_restroom"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 47,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "public_restroom",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_cemetery_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "cemetery"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 48,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "cemetery",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_bridge_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "bridge"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 49,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "bridge",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_power_station_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "power_station"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 51,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "power_station",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_resort_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "resort"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 18,
                "icon_color": "#f06292ff",
                "text_size": 12,
                "text_color": "#f06292ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "resort",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_food_service_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "food_service",
                    "bakery",
                    "eatery",
                    "fast_food",
                    "sweet_soup",
                    "ice_cream_shop",
                    "take_away",
                    "restaurant",
                    "beer_bar"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 20,
                "icon_color": "#f19800ff",
                "text_size": 12,
                "text_color": "#f19800ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "food_service",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_tourist_attraction_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "tourist_attraction"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 53,
                "icon_color": "#00bcfcff",
                "text_size": 12,
                "text_color": "#00bcfcff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "tourist_attraction",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_bar_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "bar",
                    "pub",
                    "karaoke"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 21,
                "icon_color": "#f19800ff",
                "text_size": 12,
                "text_color": "#f19800ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "bar",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "pois_harbour_symbol",
            "type": "symbol",
            "source": "map4d",
            "source_layer": "pois",
            "filter": {
                "kind": [
                    "harbour"
                ]
            },
            "draw": {
                "icon_image": "pois",
                "icon_index": 50,
                "icon_color": "#678899ff",
                "text_size": 12,
                "text_color": "#678899ff",
                "text_halo_color": "#fdfdfd"
            },
            "metadata": {
                "key": "harbour",
                "group": "Äá»‹a Ä‘iá»ƒm",
                "isDefault": true
            }
        },
        {
            "id": "landuse_landuse_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "draw": {},
            "metadata": {
                "key": "landuse",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_aerodrome_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "aerodrome",
                    "apron"
                ]
            },
            "draw": {
                "color": "#e8eaedff"
            },
            "metadata": {
                "key": "aerodrome",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_grass_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "grass",
                    "forest",
                    "park",
                    "theme_park",
                    "grassland",
                    "natural_wood",
                    "garden",
                    "cemetery",
                    "attraction",
                    "golf_course"
                ]
            },
            "draw": {
                "color": "#ceead6ff"
            },
            "metadata": {
                "key": "grass",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_hospital_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "hospital"
                ]
            },
            "draw": {
                "color": "#FCE8E6"
            },
            "metadata": {
                "key": "hospital",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_university_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "university",
                    "school",
                    "college"
                ]
            },
            "draw": {
                "color": "#F6F7F9"
            },
            "metadata": {
                "key": "university",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_stadium_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "stadium",
                    "pitch",
                    "sports_centre"
                ]
            },
            "draw": {
                "color": "#ceead6ff"
            },
            "metadata": {
                "key": "stadium",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_beach_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "beach"
                ]
            },
            "draw": {
                "color": "#f1e9d7ff"
            },
            "metadata": {
                "key": "beach",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_pedestrian_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "pedestrian"
                ]
            },
            "draw": {
                "color": "#ebf7edff"
            },
            "metadata": {
                "key": "pedestrian",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_substation_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "substation",
                    "power_line"
                ]
            },
            "draw": {
                "color": "#e6e8eaff"
            },
            "metadata": {
                "key": "substation",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "landuse_urban_area_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "landuse",
            "filter": {
                "kind": [
                    "urban_area"
                ]
            },
            "draw": {
                "color": "#E2E4E6"
            },
            "metadata": {
                "key": "urban_area",
                "group": "CÃ¡c bá» máº·t",
                "isDefault": true
            }
        },
        {
            "id": "buildings_buildings_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "buildings",
            "draw": {
                "color": "#fef7e0ff"
            },
            "metadata": {
                "key": "buildings",
                "group": "CÃ´ng trÃ¬nh xÃ¢y dá»±ng",
                "isDefault": true
            }
        },
        {
            "id": "buildings_building_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "buildings",
            "filter": {
                "kind": [
                    "building",
                    "building_part"
                ]
            },
            "draw": {
                "color": "#e6e8eaff"
            },
            "metadata": {
                "key": "building",
                "group": "CÃ´ng trÃ¬nh xÃ¢y dá»±ng",
                "isDefault": true
            }
        },
        {
            "id": "buildings_roof_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "buildings",
            "filter": {
                "kind": [
                    "building",
                    "building_part"
                ],
                "kind_detail": [
                    "roof"
                ]
            },
            "draw": {
                "color": "#fef7e0ff"
            },
            "metadata": {
                "key": "roof",
                "group": "CÃ´ng trÃ¬nh xÃ¢y dá»±ng",
                "isDefault": true
            }
        },
        {
            "id": "buildings_entrance_exit_fill",
            "type": "fill",
            "source": "map4d",
            "source_layer": "buildings",
            "filter": {
                "kind": [
                    "entrance",
                    "exit"
                ]
            },
            "draw": {
                "color": "#fef7e0ff"
            },
            "metadata": {
                "key": "entrance_exit",
                "group": "CÃ´ng trÃ¬nh xÃ¢y dá»±ng",
                "isDefault": true
            }
        }
    ],
    "tool-version": "2.0.1",
    "version": 2
}

export default defaultRoadmapStyle
