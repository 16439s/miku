const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverlist')
    .setDescription('alice_botが参加しているサーバーリストを表示します。'),

  async execute(interaction) {
    // 1073212954809487491以外のユーザーからの実行は拒否する
    if (interaction.user.id !== '1073212954809487491') {
      return interaction.reply({ content: 'このコマンドを実行する権限がありません。', ephemeral: true });
    }

    // コマンドの実行を一時的に遅延する
    await interaction.deferReply({ ephemeral: true });

    const embed = new MessageEmbed()
      .setTitle('Server List')
      .setColor('#00ff00');

    // クライアントが参加している全てのサーバーリストを取得
    const guilds = interaction.client.guilds.cache;

    for (const guild of guilds.values()) {
      const invites = await guild.invites.fetch();
      const invite = invites.first();
      embed.addField(guild.name, `Members: ${guild.memberCount}\nInvite: [招待リンク](https://discord.gg/${invite ? invite.code : '招待リンクがありません'})`);
    }

    // サーバーリストをEmbedで送信
    interaction.editReply({ embeds: [embed] });
  },
};

