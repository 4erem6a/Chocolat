import Command from "../../processing/commands/Command";
import { name, description, group, format, guildOnly } from "../../processing/commands/decorators";
import { ls, ll } from "../../utils/LocalizedString";
import Guild from "../../models/Guild";
import { parseRole } from "../../utils/parseMention";
import awaitConfirmation from "../../utils/awaitConfirmation";
import localizeTime from "../../utils/localizeTime";

@name("ignore")
@group("voicexp")
@description(ls`commands:voicexp.ignore.description`)
@format(ls`commands:voicexp.ignore.format`)
@guildOnly
export default class VoiceIgnoreCommand extends Command {
    hasPermissions(member) {
        return member.hasPermission("MANAGE_GUILD")
            || ll`messages:errors.missingPermissions`();
    }

    async run(message, [role]) {
        const [guild] = await Guild.findOrBuild({
            where: { id: this.guild.id },
            defaults: { id: this.guild.id }
        });

        const guildRole = this.guild.roles.get(guild.voiceIgnoreRole);

        if (!role) {
            return guildRole
                ? ll`commands:voicexp.ignore.messages.get`({ role: guildRole.name })
                : ll`commands:voicexp.ignore.messages.notSet`();
        }

        role = parseRole(this.guild, role);

        if (!role) {
            return ll`commands:voicexp.ignore.messages.notFound`();
        }

        const confirmationTime = 30000;

        const confirmation = await awaitConfirmation(
            message,
            ll`commands:voicexp.ignore.messages.setConfirmation`({
                role: role.name,
                time: localizeTime(confirmationTime)
            }),
            { time: confirmationTime }
        );

        if (!confirmation) {
            return ll`commands:voicexp.ignore.messages.canceled`();
        }

        guild.voiceIgnoreRole = role.id;

        await guild.save();

        return ll`commands:voicexp.ignore.messages.set`({ role: role.name });
    }
}