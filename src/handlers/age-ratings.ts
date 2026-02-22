import { getClient } from "../client.js";

export async function getAgeRatingDeclaration(args: { versionId: string }) {
  const client = await getClient();
  const { data } = await client.read(
    `appStoreVersions/${args.versionId}/ageRatingDeclaration`
  );
  return data;
}

export async function updateAgeRatingDeclaration(args: {
  ageRatingDeclarationId: string;
  alcoholTobaccoOrDrugUseOrReferences?: string;
  contests?: string;
  gamblingAndContests?: boolean;
  gambling?: boolean;
  gamblingSimulated?: string;
  horrorOrFearThemes?: string;
  matureOrSuggestiveThemes?: string;
  medicalOrTreatmentInformation?: string;
  profanityOrCrudeHumor?: string;
  sexualContentGraphicAndNudity?: string;
  sexualContentOrNudity?: string;
  seventeenPlus?: boolean;
  unrestrictedWebAccess?: boolean;
  violenceCartoonOrFantasy?: string;
  violenceRealistic?: string;
  violenceRealisticProlongedGraphicOrSadistic?: string;
}) {
  const client = await getClient();
  const attributes: Record<string, unknown> = {};

  const fields = [
    "alcoholTobaccoOrDrugUseOrReferences",
    "contests",
    "gamblingAndContests",
    "gambling",
    "gamblingSimulated",
    "horrorOrFearThemes",
    "matureOrSuggestiveThemes",
    "medicalOrTreatmentInformation",
    "profanityOrCrudeHumor",
    "sexualContentGraphicAndNudity",
    "sexualContentOrNudity",
    "seventeenPlus",
    "unrestrictedWebAccess",
    "violenceCartoonOrFantasy",
    "violenceRealistic",
    "violenceRealisticProlongedGraphicOrSadistic",
  ] as const;

  for (const field of fields) {
    if ((args as Record<string, unknown>)[field] !== undefined) {
      attributes[field] = (args as Record<string, unknown>)[field];
    }
  }

  return client.update(
    { type: "ageRatingDeclarations", id: args.ageRatingDeclarationId },
    { attributes }
  );
}
