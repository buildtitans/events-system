import type { AddressSuggestion } from "@/src/lib/hooks/search/types";
import { Box, Chip, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { HTMLAttributes, JSX } from "react";
import AddLocationIcon from '@mui/icons-material/AddLocation';

type AddressSuggestionProps = { option: AddressSuggestion, props: HTMLAttributes<HTMLElement> }
export default function AddressSuggestionOption({ option, props } : AddressSuggestionProps): JSX.Element {


    return (
        <Box
        component="li"
        {...props}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        py: 1,
        px: 1.25,
      }}
        >

            <ListItemIcon sx={{ minWidth: 0 }}>
                    <AddLocationIcon fontSize="small" />
                  </ListItemIcon>
            
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {option.label}
                        </Typography>
            
                        <Chip
                          size="small"
                          label={option.country}
                          sx={{ height: 20 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        {option.state}
                      </Typography>
                    }
                  />

        </Box>
    )

}