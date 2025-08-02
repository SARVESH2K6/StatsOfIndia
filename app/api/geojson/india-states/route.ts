import { NextResponse } from "next/server"

// This would typically fetch from a real GeoJSON file or database
// For demo purposes, we'll return the mock data
export async function GET() {
  try {
    // In a real application, you would:
    // 1. Read from a GeoJSON file in your public directory
    // 2. Fetch from a geospatial database
    // 3. Use a service like Mapbox or Google Maps

    const geoJsonData = {
      type: "FeatureCollection",
      features: [
        // This would contain the full GeoJSON data for all Indian states
        // For brevity, I'm including a few sample states
        {
          type: "Feature",
          properties: {
            ST_NM: "Maharashtra",
            ST_CEN_CD: "27",
            AREA: 307713,
            POPULATION: 112374333,
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [72.6, 20.1],
                [80.9, 20.1],
                [80.9, 16.0],
                [72.6, 16.0],
                [72.6, 20.1],
              ],
            ],
          },
        },
        // Add more states here...
      ],
    }

    return NextResponse.json(geoJsonData)
  } catch (error) {
    console.error("Error fetching GeoJSON data:", error)
    return NextResponse.json({ error: "Failed to fetch GeoJSON data" }, { status: 500 })
  }
}
