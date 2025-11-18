import arcpy
import random
arcpy.env.overwriteOutput = True

out_name = "WorldCities_rand_types"
# Input and output paths
input_fc = r"C:\data\MyDefaultGdb.gdb\WorldCities_Wgs84"
output_fc = r"C:\data\MyDefaultGdb.gdb\WorldCities_rand_types"

# Copy schema to new feature class
arcpy.management.CreateFeatureclass(
    out_path=r"C:\data\MyDefaultGdb.gdb",
    out_name=out_name,
    geometry_type="POINT",
    spatial_reference=input_fc
)

# Add fields from original FC
fields = [f.name for f in arcpy.ListFields(input_fc) if f.type not in ("OID", "Geometry")]
for field in fields:
    arcpy.management.AddField(output_fc, field, "TEXT")

# Add 'type' field
arcpy.management.AddField(output_fc, "type", "TEXT")

# Insert features
insert_fields = fields + ["SHAPE@", "type"]
with arcpy.da.InsertCursor(output_fc, insert_fields) as icur:
    for i in range(5):  # Repeat 5 times
        with arcpy.da.SearchCursor(input_fc, fields + ["SHAPE@"]) as scur:
            for row in scur:
                new_row = list(row) + [random.choice(["type1", "type2", "type3", "type4", "type5"])]
                icur.insertRow(new_row)

print("Done! Created expanded feature class with random types.")