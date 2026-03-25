"use client";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import FadeInOutBox from "../box/motionboxes/fadeInOutBox";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { type JSX } from "react";
import Typography from "@mui/material/Typography";
import { EventSchemaType } from "@/src/schemas/events/eventSchema";
import OpenedEventImage from "../box/cards/openedEventImage";
import {
  GroupSlug,
  NameOfGroup,
  NumberOfAttendantsType,
} from "@/src/lib/store/slices/events/EventDrawerSlice";
import { toMonthDayYearHour } from "@/src/lib/utils/parsing/toMonthDayYearHour";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/src/lib/store";
import { enqueueDrawer } from "@/src/lib/store/slices/rendering/RenderingSlice";
import { TitleTypography } from "../box/cards/group";
import { isFutureOrNow } from "@/src/lib/utils/dates/isFutureOrNow";

const stackProps = {
  marginX: 3,
  paddingTop: 2,
  paddingBottom: 2,
  alignItems: "start",
  borderBottom: 1,
  borderColor: "rgb(255, 255, 255, 0.15)",
};

type OpenedEventProps = {
  event: EventSchemaType;
  numAttendants?: NumberOfAttendantsType;
  numInterested?: NumberOfAttendantsType;
  name: NameOfGroup;
  slug: GroupSlug;
};

export default function OpenedEvent({
  event,
  numAttendants,
  numInterested,
  name,
  slug,
}: OpenedEventProps): JSX.Element {
  const thumbnail = event.img;
  const startTime = toMonthDayYearHour(event.starts_at);
  const isCurrent = isFutureOrNow(new Date(event.starts_at));

  return (
    <FadeInOutBox>
      <Stack sx={stackProps} spacing={1}>
        <GroupName slug={slug} name={name} />

        <EventTitle title={event.title} />

        <OpenedEventImage thumbnail={thumbnail} />

        <EventDescription description={event.description} />

        <StartTime startTime={startTime} />

        {numAttendants && event.status === "scheduled" && (
          <EventAttendants
            numAttendants={numAttendants}
            numInterested={numInterested}
            isCurrent={isCurrent}
          />
        )}
      </Stack>
    </FadeInOutBox>
  );
}

type GroupNameProps = {
  slug: GroupSlug;
  name: NameOfGroup;
};

function GroupName({ slug, name }: GroupNameProps): JSX.Element | null {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  if (slug.status !== "ready" || name.status !== "ready") return null;

  const openGroupBySlug = () => {
    const route = `/group/${slug.data}`;
    router.push(route);
    dispatch(enqueueDrawer(null));
  };

  return (
    <Box
      onClick={openGroupBySlug}
      component={"div"}
      sx={{
        cursor: "pointer",
        width: "100%",
      }}
    >
      <TitleTypography
        gutterBottom
        variant="h6"
        sx={{
          fontSize: "16px",
          fontWeight: "light",
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        {name.data}
        <NavigateNextRoundedIcon className="arrow" sx={{ fontSize: "1rem" }} />
      </TitleTypography>
    </Box>
  );
}

function EventAttendants({
  numAttendants,
  numInterested,
  isCurrent,
}: {
  numAttendants: NumberOfAttendantsType;
  isCurrent: boolean;
  numInterested?: NumberOfAttendantsType;
}) {
  return (
    <Box
      sx={{
        width: "90%",
        height: "auto",
        textAlign: "left",
        color: "white",
        paddingY: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      {isCurrent && (
        <>
          {numAttendants.status === "ready" && (
            <Typography variant="caption" fontSize={"16px"}>
              {numAttendants.data > 1 &&
                `${numAttendants.data} people are going`}
              {numAttendants.data === 1 &&
                `${numAttendants.data} person is going`}
              {numAttendants.data === 0 && "Nobody is attending yet"}
            </Typography>
          )}

          {numInterested && numInterested.status === "ready" && (
            <Typography
              variant="caption"
              fontSize={"16px"}
              sx={{
                color: "rgba(255, 255, 255, 0.6)",
              }}
            >
              {numInterested.data > 1 &&
                `${numInterested.data} people have expressed interest`}
              {numInterested.data === 1 &&
                `${numInterested.data} person is interested`}
            </Typography>
          )}
        </>
      )}

      {!isCurrent && numAttendants.status === "ready" && (
        <>
          <Typography variant="caption" fontSize={"16px"}>
            {numAttendants.data > 1 && `${numAttendants.data} people went`}
            {numAttendants.data === 1 && `${numAttendants.data} person went`}
            {numAttendants.data < 1 && "This event had no attendants"}
          </Typography>
        </>
      )}
    </Box>
  );
}

function EventTitle({
  title,
}: {
  title: EventSchemaType["title"];
}): JSX.Element {
  return (
    <Box
      sx={{
        width: "90%",
        height: "auto",
        textAlign: "center",
        color: "white",
      }}
    >
      <Typography
        component={"h2"}
        sx={{
          fontSize: "21px",
          fontWeight: "light",
          textAlign: "left",
          textWrap: "wrap",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

function EventDescription({
  description,
}: {
  description: EventSchemaType["description"];
}): JSX.Element {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        textAlign: "center",
        borderRadius: 2,
        gap: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <Typography
        component={"h3"}
        sx={{
          textAlign: "left",
          color: "rgba(255, 255, 255, 0.85)",
          width: "100%",
          fontSize: "18px",
          fontWeight: "light",
          borderBottom: 1,
          borderColor: "rgb(255, 255, 255, 0.15)",
        }}
      >
        Event Details
      </Typography>

      <Typography
        component={"p"}
        sx={{
          fontWeight: "light",
          fontSize: "14px",
          color: "white",
          textAlign: "left",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}

function StartTime({ startTime }: { startTime: string }) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        textAlign: "center",
        borderRadius: 2,
        gap: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <Typography
        component={"h3"}
        sx={{
          textAlign: "left",
          color: "rgba(255, 255, 255, 0.75)",
          width: "100%",
          fontSize: "14px",
          fontWeight: "light",
        }}
      >
        Scheduled for {startTime}
      </Typography>
    </Box>
  );
}
